


build/stateYear.json: build/us_40.geojson build/stateByYear.csv 
	topojson \
	-o $@ \
	--id-property=NAME,statename \
	-e build/stateByYear.csv \
	-p  \
	-- build/us_40.geojson build/stateByYear.csv 

us_stateYear.json: build/stateYear.json 
	topojson-merge \
	-o $@ \
	--in-object=us_40 \
	--out-object=nation \
	-- $<

dollop_timeline.json: us_stateYear.json data/the_dollop.csv
	topojson \
	-o $@ \
	--id-property=state,bstate \
	-e data/the_dollop.csv \
	-p \
	-- $<

