
import mlb
import numpy as np
import json

db_name = 'lahman2015'

class myc:
    def __init__(self):
        self.mlb = mlb.mlb()
        self.all_teams = self.get_all_teams()
        self.wswin_teams = self.get_wswin_teams()
        self.keys_for_quartiles \
            = ['r', 'ra', 'h', '2b', '3b', 'xb', 'hr',
               'sb', 'tb', 'bavg', 'obp', 'slg'
               ]

    def get_wswin_teams(self):
        q = ('select '
             'yearid, '
             'teamid, teamidbr, teamidlahman45, teamidretro,'
             'w, l, r, ab, h, 2b, 3b, (2b+3b) xb, hr,'
             'bb, so, sb, cs, ra, er, era, sho, sv, name, '
             'teamidbr, teamidretro, '
             'h/ab as bavg, '
             '(h+bb)/(ab+bb) as obp, '
             '(h + 2b + 2*3b + 3*hr) as tb,'
             '(h + 2b + 2*3b + 3*hr) / ab as slg '
             'from {}.teams where yearid>=1947 and wswin=\'y\''.format(db_name)
             )
        return self.mlb.sqlQueryToArray(q)

    def get_mean(self, yearid, k):
        q = ('select avg({}) {} from {}.teams '
             'where yearid={:d}'.format(k, k, db_name, yearid)
             )
        ans = self.mlb.sqlQueryToArray(q)
        return ans[k]

    def get_all_teams(self):
        q = ('select '
             'yearid, teamid, w, l, r, ab, h, 2b, 3b, (2b+3b) xb, hr,'
             'bb, so, sb, COALESCE(cs, -1) cs, ra, er, era, sho, sv, name, '
             'teamidbr, teamidretro, '
             'h/ab as bavg, '
             '(h+bb)/(ab+bb) as obp, '
             '(h + 2b + 2*3b + 3*hr) as tb,'
             '(h + 2b + 2*3b + 3*hr)/ab as slg '
             'from {}.teams where yearid>=1947'.format(db_name)
             )
        return self.mlb.sqlQueryToArray(q)

    def make_stat_record(self, stat_name):
        a = {}
        a['stat_name'] = stat_name

        a['mean'] = np.mean(self.all_teams[stat_name])
        a['median'] = np.percentile(self.all_teams[stat_name], 50)
        a['quartile_low'] = np.percentile(self.all_teams[stat_name], 25)
        a['quartile_high'] = np.percentile(self.all_teams[stat_name], 75)

        a['whisker_high90'] = np.percentile(self.all_teams[stat_name], 90)
        a['whisker_low90'] = np.percentile(self.all_teams[stat_name], 10)
        a['max'] = np.max(self.all_teams[stat_name])

        return a

    def make_team_record(self, row):
        a = {}
        a['yearid'] = row['yearid']
        a['team_name'] = row['name']
        a['teamid'] = row['teamid']
        a['teamidbr'] = row['teamidbr']
        a['teamidretro'] = row['teamidretro']
        a['w'] = row['w']
        a['l'] = row['l']
        for k in self.keys_for_quartiles:
            a[k] = row[k]
        a['rs_plus'] = (row['r']/self.get_mean(a['yearid'], 'r'))[0]
        a['ra_plus'] = (row['ra']/self.get_mean(a['yearid'], 'ra'))[0]
        team_positions = self.get_positions(row['teamid'], row['yearid'])
        for fldpos, player_stats in team_positions.items():
            fld_key = 'fld{:d}'.format(fldpos)
            a[fld_key] = {}
            for stat_name, stat_value in player_stats.items():
                a[fld_key][stat_name] = stat_value

        topN = self.get_top_n(row['teamidbr'], row['yearid'])
        print('topN', topN)
        for i, v in enumerate(topN):
            a['top_war_off{:d}'.format(i)] = v['war_off']
            a['top_war_def{:d}'.format(i)] = v['war_def']
            a['top_war{:d}'.format(i)] = v['war']
            a['top_name{:d}'.format(i)] = v['name_common']
        return a

    def get_top_n(self, teamid, yearid, n=20):
        q = ('select a.* from '
             '(select name_common, war, war_off, war_def '
             'from mlb.brwar_bat where year_id={:d} and team_id=\'{}\' '
             'UNION '
             'select name_common, war, 0 war_off, war war_def '
             'from mlb.brwar_pitch where year_id={:d} and team_id=\'{}\' ) '
             'a order by war desc '
             'limit {:d}'.format(yearid, teamid,
                                 yearid, teamid, n))
        return self.mlb.sqlQueryToArray(q)

    def get_positions(self, teamid, yearid):
        q = ''

        k = 'home'
        q += 'select {}_team_id'.format(k)
        for i in range(1, 10):
            q += (',{}_lineup{:d}_bat_id bat{:d} '
                  ',{}_lineup{:d}_fld_cd fld{:d} '.format(k, i, i, k, i, i))
        q += ' from retrosheet.gamelogs '
        q += (' where year_id={:d} '
              'and {}_team_id=\'{}\''.format(yearid, k, teamid)
              )
        q += ' UNION '

        k = 'away'
        q += 'select {}_team_id'.format(k)
        for i in range(1, 10):
            q += (',{}_lineup{:d}_bat_id bat{:d} '
                  ',{}_lineup{:d}_fld_cd fld{:d} '.format(k, i, i, k, i, i))
        q += ' from retrosheet.gamelogs '
        q += (' where year_id={:d} '
              'and {}_team_id=\'{}\''.format(yearid, k, teamid))

        data = self.mlb.sqlQueryToArray(q)
        aa = {}
        for d in data:
            for i in range(1, 10):
                b = d['bat{:d}'.format(i)]
                f = d['fld{:d}'.format(i)]

                if not f in aa:
                    aa[f] = {}
                v = aa[f].get(b, 0)
                v += 1
                aa[f][b] = v
        bb = {}
        for fldpos in aa:
            mm = []
            for bat_id, pa in aa[fldpos].items():
                mm.append([pa, bat_id])
            mm.sort(reverse=True)
            bb[fldpos] = mm[0]

        cc = {}
        for fldpos, t in bb.items():
            if fldpos==1:
                continue
            ngame, bat_id = t
            q = (' select a.namefirst, a.namelast, '
                 'b.g, b.ab, b.r, b.h, '
                 'b.2b, b.3b, (b.2b+b.3b) xb, b.hr, b.rbi, '
                 'b.h/ab as bavg, '
                 '(b.h+b.bb)/(b.ab+b.bb) as obp, '
                 '(b.h + b.2b + 2*b.3b + 3*b.hr)/b.ab as slg'
                 ' from {}.master a '
                 'inner join {}.batting b on a.playerid=b.playerid '
                 'where a.retroid=\'{}\' and b.yearid={:d} '
                 'order by g desc limit 1'.format(db_name, db_name, bat_id, yearid)
                 )
            ans = self.mlb.sqlQueryToArray(q)
            cc[fldpos] = {'player_id': bat_id,
                          'player_name': ans['namefirst'][0] + ' ' + ans['namelast'][0]}

            for stat in ans.dtype.names:
                cc[fldpos][stat] = ans[stat][0]

        return cc

    def make_json_file(self, ofile='output.json'):
        with open(ofile, 'w') as fh:
            fh.write(self.make_json())

    def make_json(self):
        ans = {}
        team_data = []
        for row in self.wswin_teams:
            print row['yearid']
            team_data.append(self.make_team_record(row))
        ans['teams'] = team_data
        stats_data = []
        for stat_name in self.keys_for_quartiles:
            stats_data.append(self.make_stat_record(stat_name))
        ans['stats'] = stats_data
        ans['games'] = self.make_seeds_structure()
        return json.dumps(ans)

    def make_seeds_structure(self):
        lines = open('seeds.txt').readlines()
        tier = 1
        idx = 0
        ans = {}
        for l in lines:
            tmp = {}
            s = l.strip('\n')
            if len(s)==0:
                tier += 1
                continue
            idx += 1
            v = int(s)
            high_seed = v
            low_seed = 65 - v
            tmp['low_seed'] = low_seed
            tmp['high_seed'] = high_seed
            tmp['idx'] = idx
            tmp['tier'] = tier
            ans[idx] = tmp
        return ans

if __name__=='__main__':
    c = myc()
    print(c.teams)
