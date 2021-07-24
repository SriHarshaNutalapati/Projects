/*
	This is common for all the tables in property panel.
	Just create new JiffyTable and pass the required settings.
	@author: Sri Harsha
*/
class JiffyTable{
	constructor(settings){
		this._type = "JiffyTable"
		this.addDefaultSettings();
		this.settings = {...this.defaultSettings, ...settings};
		this.parent_element = settings.container;
		this.view_element = this.initialize();
		this.preProcessData();
		this.ajax_caller = new DataSupplier();
		this.attachTabletoDOM(); // Empty table attached to DOM.

		this.table_contents = {};
		this.settings.reDrawTable = this.drawTable();
		this.createChildren();  // populate contents to empty table
		this.drawTable()();
	};

	addDefaultSettings(){
		this.defaultSettings= {
			"container": null,
			"utility_class": "",
			"table_heading": "",
			"table_heading_classes": "",
			"search_columns_width": "",
			"table_id": "",
			"url": "",
			"extra_urls": {},
			"columns": [],
			"ordered_columns": [],
			"non_db_columns": [],
			"pk_columns": null,
			"cells_extra_attributes": {},
			"search_columns": [],
			"add_row_btn_required": false,
			"grid_column_width": "",
			"head_row_height": "minmax(35px, auto)",
			"body_row_height": "minmax(30px, auto)",
			"records_per_page": 10,
			"enable_pagination": true,
			"pagination_style": "remote", // "remote" => make db call for every operation(like page change, search etc)
										  // "local" => make db call only once and get all data in one shot. no other db call need to be made for page change, search etc
			"request_data": {"filters":  [], "order": {}, "limit": 10, "offset": 0, "extra_data": ""}, // Initial request data
			"filter_required": false,
			"current_page": 1,
			"extra_request_data": "",
			"total_records": null,
			"total_pages": null,
			"all_table_data": null, // for pagination local, we store the full data in this key
		};
	}

	initialize(){
		let table_obj = document.createElement("div");
		table_obj.classList.add("jiffy-table-root");
		table_obj.setAttribute("id", this.settings.table_id);
		return $(table_obj);
	};

	preProcessData(){
		this.settings.ordered_columns = this.settings.columns.map(column => column.field);
		this.settings.non_db_columns = this.settings.columns.filter(column => column.non_db_column).map(column=> column.field);
		this.settings.cells_extra_attributes = {...this.settings.ordered_columns.reduce((o, key) => ({ ...o, [key]: {}}), {}), ...this.settings.cells_extra_attributes};
		this.settings.search_columns = this.settings.columns.filter(column => {if(column.search) return column});
		this.settings.grid_column_width = this.getColumnWidth();
		this.settings.request_data.extra_data = this.settings.extra_request_data;
		this.settings.request_data.limit = this.settings.records_per_page;
		if(this.settings.pagination_style == "local") this.settings.request_data.limit = -1 // get all the records in first call
	};

	createChildren(){
		this.table_contents["table_main_head"] = new JiffyTableMainHeadRow(this.settings, this.view_element);
		this.table_contents["table_head"] = new JiffyTableHead(this.settings, this.view_element);
		this.table_contents["table_body"] = new JiffyTableBody(this.settings, this.view_element);
		this.table_contents["table_footer"] = new JiffyTableFooter(this.settings, this.view_element);
	};

	drawTable(){
		var that=this;
		return function(clearBody=false, notification=""){
			if(that.settings.pagination_style == "remote") that.drawRemoteTable(clearBody, notification);
			if(that.settings.pagination_style == "local") that.getLocalTableData(clearBody, notification);
		}
	};

	drawRemoteTable(clearBody, notification){
		show_overlay_loading(this.settings.container, "");
		let data_promise = this.ajax_caller.getRequiredData(this.settings.url, this.settings.request_data);
		data_promise.then((data) => {
			if(data.status){
				let body_msg = "No data available in the table.";
				if(notification == "DRAW_SEARCH") body_msg = "No data available for the provided search criteria."
				if(notification != "DRAW_SEARCH") this.table_contents["table_main_head"].drawFilterDropdown(this.settings.utility_class.getFilterDict(this.settings));
				this.table_contents["table_body"].drawBody(data.data.results, clearBody, body_msg);
			    this.table_contents["table_footer"].drawFooter(data);
			}else{
				let error_message = ""
				if(notification == "DRAW_SEARCH") error_message = "Please check your search query and try again"
				_message("error", `A problem occured in loading the table. ${error_message}. Error code: ${data.error.message.code}`, "error-strip");
				console.error(data.error.message.text);
			}
			remove_overlay_loading();
		}).catch((error) => {
			_message("error", "Server error: Not able to get the records.", "error-strip");
		    console.error(error);
		    remove_overlay_loading();
		});
	};

	getLocalTableData(clearBody, notification){
		show_overlay_loading(this.settings.container, "");
		// first db call and get all data in one shot
		if(this.settings.all_table_data == null){
			let data_promise = this.ajax_caller.getRequiredData(this.settings.url, this.settings.request_data);
			data_promise.then((data) => {
				if(data.status){
					this.settings.all_table_data = data;
					this.table_contents["table_main_head"].drawFilterDropdown(this.settings.utility_class.getFilterDict(this.settings));
					this.drawLocalTable(clearBody, notification);
				}else{
					_message("error", `A problem occured in loading the table. ${error_message}. Error code: ${data.error.message.code}`, "error-strip");
					console.error(data.error.message.text);
				}
				remove_overlay_loading();
			}).catch((error) => {
				_message("error", "Server error: Not able to get the records.", "error-strip");
			    console.error(error);
			    remove_overlay_loading();
			});
		}else{
			this.drawLocalTable(clearBody, notification);
			remove_overlay_loading();
		}
	};

	drawLocalTable(clearBody, notification){
		// calculate offset
		let body_msg = "No data available in the table.";
		if(notification == "DRAW_SEARCH") body_msg = "No data available for the provided search criteria."
		let required_data = this.settings.utility_class.getFilteredData(this.settings);
		let footer_data = {"data": {"total_count": required_data.length}}
		required_data = required_data.slice(this.settings.current_page*10 - 10, this.settings.current_page * 10);
		this.table_contents["table_body"].drawBody(required_data, clearBody, body_msg);
	    this.table_contents["table_footer"].drawFooter(footer_data);
	};

	attachTabletoDOM(){
		this.parent_element.html(this.view_element);
	};

	getColumnWidth(){
		return this.settings.utility_class.getColumnsWidth()
	};
}

class JiffyTableMainHeadRow{
	constructor(settings, parent_element){
		// This row has no cells
		this.settings = settings;
		this.parent_element = parent_element;
		this.view_element = this.initialize();
		this._type = "JiffyTableMainHeadingRow";
		this.addTemplates();

		// render row
		this.drawRow();
	};

	initialize(){
		let trow_element = document.createElement("div");
		trow_element.classList.add("jiffy-table-mainhead-row");
		return $(trow_element);
	};

	attachToParent(){
		this.parent_element.append(this.view_element);
	};

	addTemplates(){
		this.template= `
		<div class="portlet">
			<div class="portlet-header jiffy-main-heading-portlet <%= table_heading_classes %>">
				<span class="jiffy-table-main-head"><%= table_heading%></span>
				<div class="jiffy-table-utility-button-container">
					<% if(filter_required){ %>
						<button type="button" class="btn btn-xs dropdown-toggle jiffy-table-filter-btn" title="Filter">
							<i class="jiffy-table-filter-icon icon-list iconmoon view_mode_disabled_icon"></i>
						</button>
					<% } %>
					<% if(search_columns.length != 0){ %>
						<button type="button" class="btn btn-xs jiffy-table-search-btn" title="Search">
							<span aria-hidden="true" class="icomoon search icomoon-16px"></span>
						</button>
					<% } %>
					<% if(add_btn_required){ %>
						<button type="button" class="btn btn-xs jiffy-table-add-btn" title="Add">
							<i class="jiffy-table-add-icon icon-plus iconmoon view_mode_disabled_icon"></i>
						</button>
					<% } %>
				</div>
				<%= search_dd_template %>
				<%= filter_dd_template %>
			</div>
		</div>`;

		this.search_dd_template= `
		<div class="jiffy-table-search-dropdown hidden">
			<div class="jiffy-table-search-dropdown-inputs" style="grid-template-columns: <%= search_columns_width %>">
				<% _.forEach(search_columns, function (column) {%>
					<div class="jiffy-table-search-dropdown-input-holder">
						<label class="jiffy-table-search-dd-label"><%= column.search_title || column.title %></label>
						<% if(column.period) {%>
							<div class="period_inps_container">
								<div style="position: relative">
									<input type="<%= column.type || 'text' %>" data-period-start="true" data-period="true" class="form-control jiffy-table-search-dd-input <%= column.classes[0] || "" %>" data-field="<%= column.field %>" data-operator= "<%= column.operator || 'contains' %>"/>
									<i class="fa fa-calendar search_dd_calendar_icon"></i>
								</div>
								<span style="text-align: center;">-</span>
								<div style="position: relative">
									<input type="<%= column.type || 'text' %>" data-period-end="true" data-period="true" class="form-control jiffy-table-search-dd-input <%= column.classes[1] || "" %>" data-field="<%= column.field %>" data-operator= "<%= column.operator || 'contains' %>"/>
									<i class="fa fa-calendar search_dd_calendar_icon"></i>
								</div>
							</div>
						<% }else{ %>
							<% if(column.search_field && column.search_field == "select") { %>
								<select class="form-control jiffy-table-search-dd-input <%= column.classes || "" %>" data-field="<%= column.field %>" data-operator= "<%= column.operator || 'contains' %>">
									<option selected value="">Select a <%= column.title %></option>
									<% _.forEach(column.options, function (option) {%>
										<option value="<%= option.value %>"><%= option.display_name %></option>
									<% }); %>
								</select>
							<% }else{ %>
								<input type="<%= column.type || 'text' %>" class="form-control jiffy-table-search-dd-input <%= column.classes || "" %>" data-field="<%= column.field %>" data-operator= "<%= column.operator || 'contains' %>"/>
							<% } %>
						<% } %>
					</div>
				<% }); %>
				<button type="button" class="btn jiffy-btn-tertiary jiffy-table-search-dd-clear-btn">CLEAR</button>
				<button type="button" class="btn jiffy-btn-primary jiffy-table-search-dd-submit-btn">SUBMIT</button>
			</div>
		</div>`;
		// <div class="jiffy-table-search-dropdown-buttons <%= search_btn_class %>"></div>
		// This is template for single column filter only.
		this.filter_dd_template=`
			<div class="jiffy-table-filter-dropdown hidden"></div>
		`

		this.filter_dd_dropdown=`
			<ul class="jiffy-table-filter-dd-list">
				<% _.forEach(filter_list, function (filter) {%>
				    <% if (filter == "Dropbox") { %>
				    <li class="jiffy-table-filter-option" data-filter="DropBox" data-column="<%= filter_column %>">
				    <% } else{%>
				    <li class="jiffy-table-filter-option" data-filter="<%= filter %>" data-column="<%= filter_column %>">
				    <% } %>
						<%= filter %>
						<i class="fas fa-check pull-right hidden jiffy_filter_dd_checkmark" style="color: #508D53"></i>
					</li>
				<% }); %>
			</ul>
		`
	}

	drawRow(){
		let search_dict = {"search_columns": this.settings.search_columns,"search_columns_width": this.settings.search_columns_width, "search_btn_class": this.settings.table_id + "_search_container"};
		let search_dd_tmpl = this.settings.utility_class.search_dd_template || this.search_dd_template;
		let filter_dd_tmpl = this.filter_dd_template;
		this.view_element.html(_.template(this.template)({
			"table_heading": this.settings.utility_class.render_table_heading(this.settings.table_heading),
			"filter_required": this.settings.filter_required,
			"search_dd_template": _.template(search_dd_tmpl)(search_dict),
			"add_btn_required": this.settings.add_row_btn_required,
			"table_heading_classes": this.settings.table_heading_classes,
			"search_columns": this.settings.search_columns,
			"filter_dd_template": _.template(filter_dd_tmpl)(),
		}));
		this.attachToParent();
		this.bindEvents();
		this.settings.utility_class.table_specific_changes(this.view_element);
	};

	bindEvents(){
		this.view_element.find(".jiffy-table-search-btn").on("click", e => {
			let dd_element = this.view_element.find(".jiffy-table-search-dropdown");
			let top_height = this.view_element.find(".jiffy-main-heading-portlet").outerHeight();
			let margin_left = parseInt(this.view_element.find(".jiffy-main-heading-portlet").css("padding-left"));
			dd_element.css({
				"top": top_height,
				"margin-left": -margin_left
			});
			dd_element.toggleClass("hidden");
			// hide filter dropdown
			if(this.view_element.find(".jiffy-table-filter-dropdown")) this.view_element.find(".jiffy-table-filter-dropdown").addClass("hidden")
			// if(dd_element.hasClass("hidden")) this.view_element.find(".jiffy-table-search-btn").find("i.jiffy-table-search-icon").removeClass("fas fa-times").addClass("fas fa-search");
			// if(!dd_element.hasClass("hidden")) this.view_element.find(".jiffy-table-search-btn").find("i.jiffy-table-search-icon").removeClass("fas fa-search").addClass("fas fa-times");
		});

		this.view_element.find(".jiffy-table-search-dd-submit-btn").on("click", e => {
			let that = this;
			// this.settings.request_data.filters = [];
			// inputs
			this.view_element.find(".jiffy-table-search-dd-input").filter((idx, inp) => {
				if($(inp).val() == "") {
					// remove the key from filters, if present
					this.settings.request_data.filters = this.settings.request_data.filters.filter(o => o.column != $(inp).attr("data-field"));
					return false
				};
				return true;
			}).map((idx, inp) => {
				let filter_dict = {};
				filter_dict["column"] = $(inp).attr("data-field");
				filter_dict["operator"] = $(inp).attr("data-operator");
				// for date fields
				if($(inp).attr("data-period") == "true"){
					if($(inp).attr("data-period-start") == "true") {
						filter_dict["value"] = {};
						filter_dict["value"]["from"] = $(inp).val();
					};
					if($(inp).attr("data-period-end") == "true"){
						let exis_filter_dict = that.settings.request_data.filters.find(o => o.column == $(inp).attr("data-field"));
						if(exis_filter_dict) {
							exis_filter_dict["value"]["to"] = $(inp).val()
							return false;
						}else{
							filter_dict["value"] = {};
							filter_dict["value"]["to"] = $(inp).val();
						};
					}
				}else{
					filter_dict["value"]= $(inp).val();
				}

				// check if key is already there. if yes, replace the value
				if(_.isEmpty(that.settings.request_data.filters.find(o => o.column == $(inp).attr("data-field")))){
					that.settings.request_data.filters.push(filter_dict);
				}else{
					that.settings.request_data.filters.find(o => o.column == $(inp).attr("data-field")).value = filter_dict["value"];
				}
			});
			this.settings.request_data.offset = 0; // On search, go back to first page
			this.settings.current_page = 1;
			this.view_element.find(".jiffy-table-search-dropdown").toggleClass("hidden");
			this.view_element.find(".jiffy-table-search-btn").find("i.jiffy-table-search-icon").removeClass("fas fa-times").addClass("fas fa-search");
			this.settings.reDrawTable(true, "DRAW_SEARCH");
		});

		this.view_element.find(".jiffy-table-search-dd-clear-btn").on("click", e => {
			// this.settings.request_data.filters = [];
			// clear the search data (get the search fields and remove them from filters)
			let search_fields=this.view_element.find(".jiffy-table-search-dd-input").map(function(){return $(this).data('field')}).get();
			this.settings.request_data.filters = this.settings.request_data.filters.filter(o => !search_fields.includes(o.column))
			this.settings.request_data.offset = 0; // On search, go back to first page
			this.settings.current_page = 1;
			this.view_element.find(".jiffy-table-search-dd-input").val("");
			this.view_element.find(".jiffy-table-search-dropdown").toggleClass("hidden");
			this.view_element.find(".jiffy-table-search-btn").find("i.jiffy-table-search-icon").removeClass("fas fa-times").addClass("fas fa-search");
			this.settings.reDrawTable(true);
		});

		this.view_element.find(".jiffy-table-add-btn").on("click", e => {
			// let row_modal = new this.settings.utility_class.addRow();
			let add_row_promise = this.settings.utility_class.addRow();
			add_row_promise.then((data) => {
				this.settings.reDrawTable(true);
			});
		});

		this.view_element.find(".jiffy-table-filter-btn").on("click", e => {
			let dd_element = this.view_element.find(".jiffy-table-filter-dropdown");
			let heading_offset = this.view_element.find(".jiffy-main-heading-portlet").offset();
			dd_element.toggleClass("hidden");
			let btn_offset = this.view_element.find(".jiffy-table-filter-btn").offset();
			let btn_width = this.view_element.find(".jiffy-table-filter-btn").outerWidth();
			let max_height = $(window).outerHeight() - (heading_offset.top + this.view_element.find(".jiffy-main-heading-portlet").outerHeight());
			dd_element.css({
				"top": heading_offset.top + this.view_element.find(".jiffy-main-heading-portlet").outerHeight(),
				"right": $(window).outerWidth() - (btn_offset.left + btn_width),
				"max-height": max_height
			});
			// hide search dropdown
			if(this.view_element.find(".jiffy-table-search-dropdown")) this.view_element.find(".jiffy-table-search-dropdown").addClass("hidden");
		});

		$("#node_action_panel").on("scroll", () => {
			try{
				let dd_element = this.view_element.find(".jiffy-table-filter-dropdown");
				let heading_offset = this.view_element.find(".jiffy-main-heading-portlet").offset();
				let btn_offset = this.view_element.find(".jiffy-table-filter-btn").offset();
				let btn_width = this.view_element.find(".jiffy-table-filter-btn").outerWidth();
				let max_height = $(window).outerHeight() - (heading_offset.top + this.view_element.find(".jiffy-main-heading-portlet").outerHeight());
				dd_element.css({
					"top": heading_offset.top + this.view_element.find(".jiffy-main-heading-portlet").outerHeight(),
					"right": $(window).outerWidth() - (btn_offset.left + btn_width),
					"max-height": max_height
				});
			}
			catch(error){}
		})
	};

	drawFilterDropdown(filter_dropdown_options){
		let dd_html = _.template(this.filter_dd_dropdown)(filter_dropdown_options);
		this.view_element.find(".jiffy-table-filter-dropdown").html(dd_html);
		this.view_element.find(".jiffy-table-filter-option").on("click", e => {
			let selected_option_li = $(e.target);
			if($(e.target).hasClass("jiffy_filter_dd_checkmark")) selected_option_li = $(e.target).parent();
			selected_option_li.find(".jiffy_filter_dd_checkmark").toggleClass("hidden");
			selected_option_li.toggleClass("checked");
			let selected_column = selected_option_li.data("column");
			let filter_options = this.view_element.find(".jiffy-table-filter-dd-list").find("li.jiffy-table-filter-option.checked").map(function(){return $(this).data('filter')}).get();
			if(filter_options.length == 0){
				// remove the column from filters list
				this.settings.request_data.filters = this.settings.request_data.filters.filter(o => o.column != selected_column);
			}else{
				if(!_.isEmpty(this.settings.request_data.filters.find(o => o.column==selected_column))) {
					// column is already there in filters list. replace the value
					this.settings.request_data.filters.find(o => o.column==selected_column).value = filter_options;
				}else{
					// add column in the filters list
					let filter_dict = {};
					filter_dict["column"] = selected_column;
					filter_dict["operator"] = "inlist";
					filter_dict["value"]= filter_options;
					this.settings.request_data.filters.push(filter_dict);
				}
			}
			this.settings.request_data.offset = 0; // On search, go back to first page
			this.settings.current_page = 1;
			this.settings.request_data.filters = this.settings.request_data.filters.filter(o => !_.isEmpty(o.column)) // remove any error obj where column is empty
			this.settings.reDrawTable(true, "DRAW_SEARCH");
		});
	}
}

class JiffyTableHead{
	constructor(settings, parent_element){
		// Basic attributes
		this._type = "JiffyTableHead"
		this.settings = settings;
		this.parent_element = parent_element;
		this.view_element = this.initialize();
		// Attributes related to content
		this.rows = [];
		this.row_factory = new JiffyTableRowFactory();
		this.attachToParent();
		this.addRows();
	};

	initialize(){
		let thead_element = document.createElement("div");
		thead_element.classList.add("jiffy-table-head-root");
		thead_element.setAttribute("id", this.settings.table_id + "_head");
		return $(thead_element);
	};

	addRows(){
		this.rows.push(this.row_factory.createRow(this.settings, this.view_element, this._type));
	};

	attachToParent(){
		this.parent_element.append(this.view_element);
	};
}

class JiffyTableBody{
	constructor(settings, parent_element){
		// Basic attributes
		this._type = "JiffyTableBody"
		this.settings = settings;
		this.parent_element = parent_element;
		this.view_element = this.initialize();
		// Attributes related to content
		this.rows = [];
		this.row_factory = new JiffyTableRowFactory();
		this.attachToParent();
	};

	initialize(){
		let tbody_element = document.createElement("div");
		tbody_element.classList.add("jiffy-table-body-root");
		tbody_element.setAttribute("id", this.settings.table_id + "_body");
		return $(tbody_element);
	};

	drawEmptyBody(message){
		this.view_element.html(`<div class="jiffy_table_empty_row">${message}</div>`);
	};

	drawBody(data, clearBody=false, message){
		if(clearBody) {this.rows = []; this.view_element.html("")};
		if(data.length == 0) this.drawEmptyBody(message)
		this.addRows(data);
	};

	addRows(rows_data){
		this.rows = [...this.rows, ...this.row_factory.createRow(this.settings, this.view_element, this._type, rows_data)]
	};

	attachToParent(){
		this.parent_element.append(this.view_element);
	};
}

class JiffyTableFooter{
	constructor(settings, parent_element){
		this._type = "JiffyTableFooter"
		this.settings = settings;
		this.parent_element = parent_element;
		this.view_element = this.initialize();
		this.addTemplates();
		this.attachToParent();
	};

	initialize(){
		let tfoot_element = document.createElement("div");
		tfoot_element.classList.add("jiffy-table-footer-root");
		tfoot_element.setAttribute("id", this.settings.table_id + "_footer");
		return $(tfoot_element);
	};

	addTemplates(){
		this.template= `
		<span class="jiffy-table-records-holder">Total: <%= total_records%> records</span>
		<div class="jiffy-table-pagination-holder">
			<span id="jiffy-table-pagination-left-icon" class="fas fa-caret-left fa-2x jiffy-table-pagination-icon <% if(left_disabled){ %>jiffy-table-pagination-icon-disabled<% } %>"></span>
			<div class="pagination-pages-holder">
				Page
				<input type="number" min="1" max="<%= total_pages%>" class="jiffy-table-pagination-input" value="<%= current_page%>"/>
				of <%= total_pages%>
				</div>
			<span id="jiffy-table-pagination-right-icon" class="fas fa-caret-right fa-2x jiffy-table-pagination-icon <% if(right_disabled){ %>jiffy-table-pagination-icon-disabled<% } %>"></span>
		</div>`;
	}

	attachToParent(){
		this.parent_element.append(this.view_element);
	};

	calculateTotalPages(data){
		let total_pages = Math.ceil(data.data.total_count/this.settings.records_per_page);
		if(total_pages == 0) total_pages += 1;
		this.settings.total_pages = total_pages;
	}

	drawFooter(data){
		this.settings.total_records = data.data.total_count;
		this.calculateTotalPages(data);
		// this.settings.records_per_page = data.data.total_count <= this.settings.request_data.limit?data.data.total_count:this.settings.request_data.limit;
		if(this.settings.current_page > this.settings.total_pages) this.settings.current_page = 1;
		let template_data = {
			"left_disabled": this.settings.current_page == 1?true:false,
			"right_disabled": this.settings.current_page == this.settings.total_pages?true:false,
			"total_pages": this.settings.total_pages,
			"total_records": this.settings.total_records,
			"current_page": this.settings.current_page,
			// "records_per_page": this.settings.records_per_page
		}

		this.view_element.html(_.template(this.template)(template_data));
		this.bindEvents();
	};

	bindEvents(){
		this.view_element.find("#jiffy-table-pagination-right-icon").on('click', e => {
			this.settings.current_page += 1;
			this.settings.request_data.offset = (this.settings.request_data.limit * this.settings.current_page) - this.settings.request_data.limit;
			this.settings.reDrawTable(true);
		});

		this.view_element.find("#jiffy-table-pagination-left-icon").on('click', e => {
			this.settings.current_page -= 1;
			this.settings.request_data.offset = (this.settings.request_data.limit * this.settings.current_page) - this.settings.request_data.limit;
			this.settings.reDrawTable(true);
		});

		this.view_element.find(".jiffy-table-pagination-input").on('change', e => {
			if(e.target.value == "" || parseInt(e.target.value) < 1 || parseInt(e.target.value) > this.settings.total_pages) {
				this.view_element.find(".jiffy-table-pagination-input").val(this.settings.current_page);
				_message("error", "Please provide a page number within range.", "error-strip");
				return false;
			}
			this.settings.current_page = parseInt(e.target.value);
			this.settings.request_data.offset = (this.settings.request_data.limit * this.settings.current_page) - this.settings.request_data.limit;
			this.settings.reDrawTable(true);
		});

		// this.view_element.find(".jiffy-table-records-input").on('change', e => {
		// 	this.settings.request_data.limit = ~~(e.target.value);
		// 	this.settings.request_data.offset = (this.settings.request_data.limit * this.settings.current_page) - this.settings.request_data.limit;
		// 	this.settings.reDrawTable();
		// });
	};
}

class JiffyTableRowFactory{
	createRow(settings, parent_element, type, rows_data=[]) {
		if(type == "JiffyTableHead"){
			return new JiffyTableHeadRow(settings, parent_element);
		}
		if(type == "JiffyTableBody"){
			let body_rows = [];
			rows_data.forEach(row_data => {
				body_rows.push(new JiffyTableBodyRow(settings, parent_element, row_data));
			});
			return body_rows;
		}
	};
}

class JiffyTableRow{
	constructor(settings, parent_element){
		this.settings = settings;
		this.parent_element = parent_element;
		this.view_element = this.initialize();
		this.view_element.css("grid-template-columns", this.settings.grid_column_width);
		this.cells = [];
	};

	initialize(){
		let trow_element = document.createElement("div");
		trow_element.classList.add("jiffy-table-row");
		return $(trow_element);
	};

	drawRow(){
		// To be implemented by children
	};

	addCells(){
		// To be implemented by children
	};

	attachToParent(){
		this.parent_element.append(this.view_element);
	};

	bindEvents(){
		// To be implemented by children
	};
}

class JiffyTableHeadRow extends JiffyTableRow{
	constructor(settings, parent_element){
		super(settings, parent_element);
		this._type = "JiffyTableHeadRow"
		this.view_element.addClass("jiffy-table-head-row");
		this.view_element.css("grid-template-rows", this.settings.head_row_height);
		// for cells in row
		this.cell_factory = new JiffyTableCellFactory();
		this.drawRow();
	};

	drawRow(){
		this.addCells();
		this.attachToParent();
	};

	addCells(){
		this.settings.columns.forEach((header_col, idx) => {
			this.cells.push(this.cell_factory.createCell(this.settings, this.view_element, {...header_col, ...{"indx": idx}}, this._type));
		})
	};
}

class JiffyTableBodyRow extends JiffyTableRow{
	constructor(settings, parent_element, row_data){
		super(settings, parent_element);
		this._type = "JiffyTableBodyRow"
		this.view_element.addClass(`jiffy-table-body-row ${this.settings.table_id}_body_row`);
		this.view_element.css("grid-template-rows", this.settings.body_row_height);
		this.row_data = row_data;
		// for cells in row
		this.cell_factory = new JiffyTableCellFactory();
		this.cells = [];
		this.attachToParent();
		this.drawRow();
		this.bindEvents();
	};

	drawRow(){
		this.addCells();
	};

	addCells(){
		this.settings.ordered_columns.forEach((cell, idx) => {
			let cell_data = {...{"attribute": cell, "data": this.row_data[cell] || this.settings[cell], "template": this.row_data[cell + "_template"] || ""}, ...this.settings.cells_extra_attributes[cell], ...{"id": this.row_data[this.settings.pk_column] || this.row_data["id"] || "", "indx": idx}};
			cell_data["row_info"] = this.row_data;
			this.cells.push(this.cell_factory.createCell(this.settings, this.view_element, cell_data, this._type));
		})
	};

	bindEvents(){
		this.view_element.on("click", e => {
			// expand the view element
			this.view_element.toggleClass("jiffy-table-body-row-expanded");
		});
	};
}

class JiffyTableCellFactory{
	createCell(settings, parent_element, cell_info, type){
		let cell_obj;
		if(type == "JiffyTableHeadRow"){
			cell_obj = new JiffyTableHeadCell(settings, parent_element, cell_info);
		}else if(type == "JiffyTableBodyRow"){
			cell_obj = new JiffyTableBodyCell(settings, parent_element, cell_info);
		}
		return cell_obj;
	};
}

class JiffyTableCell{
	constructor(settings, parent_element, cell_info){
		this.settings = settings;
		this.cell_info = cell_info;
		this.parent_element = parent_element;
		this.view_element = this.initialize();
		this.setAttributes();
	};

	initialize(){
		let tcell_element = document.createElement("div");
		tcell_element.classList.add("jiffy-table-cell");
		tcell_element.setAttribute("data-cell-idx", this.cell_info.indx);
		return $(tcell_element);
	};

	setAttributes(){
		// To be implemented by children;
	};

	addContent(){
		// To be implemented by children;
	};

	attachToParent(){
		this.parent_element.append(this.view_element);
	};

	addDefaultSettings(){};

	addTemplates(){};
}

class JiffyTableHeadCell extends JiffyTableCell{
	constructor(settings, parent_element, cell_info){
		super(settings, parent_element, cell_info);
		this._type = "JiffyTableHeadCell";
		this.addDefaultSettings();
		this.addTemplates();
		this.cell_info = {...this.defaults, ...this.cell_info};
		// if(this.cell_info["sorting-direction"] == "normal") this.cell_info.sort_icon = "fa-sort";
		if(this.cell_info["sorting-direction"] == "ASC") this.cell_info.sort_icon = "fa-sort-up";
		if(this.cell_info["sorting-direction"] == "DSC") this.cell_info.sort_icon = "fa-sort-down";
		this.addContent();
		this.attachToParent();
		this.bindEvents();
	};

	addDefaultSettings(){
		this.defaults = {
			"sorting": false,
			"sorting-direction": "ASC",
			"search": false,
		};
	}

	addTemplates(){
		this.template= `
		<span class="jiffy-table-cell-span"><%= title%></span>
		<% if(sorting){ %>
			<span class="jiffy-table-cell-sort-icon fas <%= sort_icon %> pull-right"></span>
		<% } %>
	`;
	}

	setAttributes(){
		this.view_element.addClass("jiffy-table-head-cell");
		this.view_element.attr({
			id: this.cell_info.column_id || this.settings.table_id + "_head_" + this.cell_info.title.split(" ").join("_"),
			sorting: this.cell_info.sorting || false,
			"sorting-direction": this.cell_info["sorting-direction"] || "ASC",
			style: this.cell_info.style || "",
			"data-field": this.cell_info.field
		});
	};

	addContent(){
		this.view_element.html(_.template(this.template)(this.cell_info));
	};

	bindEvents(){
		this.view_element.on("click", e => {
			if(this.cell_info.sorting){
				this.cell_info["sorting-direction"] = this.cell_info["sorting-direction"] == "ASC"?"DSC":"ASC";
				this.settings.request_data.order["column"] = this.view_element.attr("data-field");
				this.settings.request_data.order["order"] = this.cell_info["sorting-direction"];
				this.settings.reDrawTable(true);
				this.view_element.attr("sorting-direction", this.cell_info["sorting-direction"]);
				this.cell_info.sort_icon = this.cell_info["sorting-direction"] == "ASC"?"fa-sort-up":"fa-sort-down"
				this.view_element.find(".jiffy-table-cell-sort-icon").removeClass("fa-sort-up fa-sort-down").addClass(this.cell_info.sort_icon);
			}
		});
	};
}

class JiffyTableBodyCell extends JiffyTableCell{
	constructor(settings, parent_element, cell_info){
		super(settings, parent_element, cell_info);
		this._type = "JiffyTableBodyCell";
		this.addTemplates();
		this.addContent();
		this.attachToParent();
		this.bindEvents();
	};

	addTemplates(){
		this.template= `
		<span class="jiffy-table-cell-span" data-pk="<%= id%>" data-column="<%= attribute%>" title='<%= data%>'><%= template || data%></span>`;

		this.action_data_template=`
		<span class="jiffy-table-cell-span" data-column="<%= attribute%>">
			<% _.each(data, function(btn_info) {%>
				<button class="btn btn-default fa-lg prop_panel_tbl_icon view_mode_disabled_icon">
					<i class="<%= btn_info.class%>" id="btn_<%= btn_info.name%>_item" data-pk="<%= id%>" title="<%= btn_info.tooltip%>" data-tab="<%= btn_info.active_tab%>"></i>
					<% if(btn_info.name_req){ %><%= btn_info.icon_heading%><% } %>
				</button>
			<% });%>
		</span>`;
	}

	setAttributes(){
		this.view_element.addClass("jiffy-table-body-cell");
	};

	addContent(){
		let template_name = this.cell_info.attribute + "_template";
		this.view_element.html(_.template(this.settings.utility_class[template_name] || this[template_name] || this.template)(this.cell_info));
	};

	bindEvents(){
		this.view_element.find(".record_delete_icon").on("click", e => {
			let btn_element = this.view_element.find(".record_delete_icon");
            bootbox.confirm({
                closeButton: false,
                buttons: {
                    cancel: {label: 'No'},
                    confirm: {label: 'Yes'}
            	},
                message: this.settings.utility_class.delete_message || `Do you want to delete this ${this.settings.table_heading} ?`,
                callback: result => {
                	if(result){
                		show_overlay_loading(this.settings.container, "");
	                    let pk = btn_element.data('pk');
	                    let delete_url = this.settings.utility_class.deleteRowUrl(pk);
	                    let res = $.post(delete_url);
	                    res.done(data => {
	                        if(data.status) {
	                        	this.settings.reDrawTable(true);
	                          	_message("success", data.msg, "snackbar");
	                        } else {
	                          	_message("error", "Error:  " + data.msg, "error-strip");
	                        }

	                    });
	                    res.always(function(data){
	                      remove_overlay_loading();
	                    });
                 	}
                }
            });
		});
		this.settings.utility_class.bindCellEvents(this.view_element, this.settings);
	};
}

class DataSupplier{
	getRequiredData(request_url, request_body={}, extra_params={}){
		return new Promise((resolve, reject) => {
		    $.ajax({
		    	url: request_url,
		      	type: 'POST',
		      	data: JSON.stringify(request_body),
		      	success: function (data) {
		        	resolve(data)
		      	},
		      	error: function (error) {
		        	reject(error)
		     	},
		    });
	  	});
	};
}
// <% if(href){ %>
// 				<a href="<%= href%>" target="<%= target%>"><%= data%></a>
// 			<% }else{ %>
// 				<%= data%>
// 			<% } %>