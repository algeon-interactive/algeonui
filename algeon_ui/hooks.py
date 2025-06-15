app_name = "algeon_ui"
app_title = "Algeon ERP"
app_publisher = "Algeon Interactive"
app_description = "ERP System for Manufacturing"
app_email = "algeoninteractive@gmail.com"
app_license = "gpl-3.0"

# Apps
# ------------------

# required_apps = []

add_to_apps_screen = [
	{
		"name": "algeon_ui",
		"logo": "/assets/algeon_ui/images/algeon-logo.png",
		"title": "Algeon ERP",
		"route": "/algeon_ui",
		"has_permission": "algeon_ui.api.permission.has_app_permission"
	}
]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html

app_include_css = [
    "/assets/algeon_ui/css/algeon-ui.css",
    "/assets/algeon_ui/css/temporary-hide.css"
]
app_include_js = "/assets/algeon_ui/js/meeting_notes_dashboard.js"

def algeon_ui_update_website_context(context):
    # Set the path to your custom favicon
    context.favicon = "/assets/algeon_ui/images/favicon.png"

    # Optionally, you can also set other apple-touch-icon or similar manifest icons here
    # if the base template supports variables for them (inspect base.html to confirm)
    # context.touch_icon = "/assets/algeon_ui/images/apple-touch-icon.png" # Example

website_context = {"*": algeon_ui_update_website_context}

whitelisted_methods = [
    "algeon_ui.custom_dashboard_queries.get_distinct_item_count_per_warehouse",
    "algeon_ui.custom_dashboard_queries.get_total_stock_quantity_per_warehouse"
]

# include js, css files in header of web template
# web_include_css = "/assets/algeon_ui/css/algeon_ui.css"
# web_include_js = "/assets/algeon_ui/js/algeon_ui.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "algeon_ui/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "algeon_ui/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "algeon_ui.utils.jinja_methods",
# 	"filters": "algeon_ui.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "algeon_ui.install.before_install"
# after_install = "algeon_ui.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "algeon_ui.uninstall.before_uninstall"
# after_uninstall = "algeon_ui.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "algeon_ui.utils.before_app_install"
# after_app_install = "algeon_ui.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "algeon_ui.utils.before_app_uninstall"
# after_app_uninstall = "algeon_ui.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "algeon_ui.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"algeon_ui.tasks.all"
# 	],
# 	"daily": [
# 		"algeon_ui.tasks.daily"
# 	],
# 	"hourly": [
# 		"algeon_ui.tasks.hourly"
# 	],
# 	"weekly": [
# 		"algeon_ui.tasks.weekly"
# 	],
# 	"monthly": [
# 		"algeon_ui.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "algeon_ui.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "algeon_ui.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "algeon_ui.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["algeon_ui.utils.before_request"]
# after_request = ["algeon_ui.utils.after_request"]

# Job Events
# ----------
# before_job = ["algeon_ui.utils.before_job"]
# after_job = ["algeon_ui.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"algeon_ui.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

