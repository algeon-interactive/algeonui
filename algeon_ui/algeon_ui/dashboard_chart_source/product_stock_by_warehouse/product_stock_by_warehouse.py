# In apps/algeon_ui/algeon_ui/algeon_ui/dashboard_chart_source/product_stock_by_warehouse/product_stock_by_warehouse.py
import frappe
import json # Import the json module

@frappe.whitelist() # Ensure this decorator is present
def get_data(chart_name=None, filters=None, from_date=None, to_date=None, timespan=None, time_interval=None, heatmap_year=None):
    target_warehouse = None
    parsed_filters = {} # Initialize an empty dictionary for parsed filters

    # Print the received filters for debugging
    print(f"--- DEBUG [get_data]: Received filters type: {type(filters)}, value: {filters}")

    if filters:
        if isinstance(filters, str): # Check if filters is a string
            try:
                parsed_filters = json.loads(filters) # Try to parse it as JSON
            except json.JSONDecodeError:
                frappe.log_error(f"Failed to parse filters JSON string: {filters}", "Dashboard Chart Source Error")
                # Handle error: either proceed without filters or return an error message
                # For now, let's proceed as if no valid filters were passed if parsing fails
                pass # parsed_filters remains empty
        elif isinstance(filters, dict): # If it's already a dictionary
            parsed_filters = filters
        else:
            # Log if filters is an unexpected type
            frappe.log_error(f"Unexpected type for filters: {type(filters)}", "Dashboard Chart Source Error")


    if parsed_filters: # Use the parsed_filters dictionary
        target_warehouse = parsed_filters.get("warehouse")

    print(f"--- DEBUG [get_data]: Target warehouse after parsing: {target_warehouse}")

    # If no warehouse is selected via filter, return a message or empty data.
    if not target_warehouse:
        return {
            "labels": ["Please select a Warehouse filter for this chart on the dashboard."],
            "datasets": [{'name': 'Quantity', 'values': [0]}]
        }

    # Fetch item_code and actual_qty for the selected warehouse.
    sql_query = """
        SELECT
            b.item_code,
            COALESCE(i.item_name, b.item_code) AS display_label,
            b.actual_qty AS quantity
        FROM
            `tabBin` b
        LEFT JOIN `tabItem` i ON b.item_code = i.name
        WHERE
            b.warehouse = %(warehouse)s
            AND b.actual_qty > 0
        ORDER BY
            b.actual_qty DESC
        LIMIT 20
    """
    
    try:
        data = frappe.db.sql(sql_query, {"warehouse": target_warehouse}, as_dict=True)
    except Exception as e:
        frappe.log_error(f"Error in Product Stock by Warehouse SQL query: {e}", "Dashboard Chart Source Error")
        return {"labels": [f"Error fetching data for {target_warehouse}"], "datasets": [{"name": "Quantity", "values": [0]}]}

    if not data:
        return {
            "labels": [f"No stock found in warehouse: {frappe.utils.escape_html(target_warehouse)}"],
            "datasets": [{'name': 'Quantity', "values": [0]}]
        }

    labels = [d.display_label for d in data]
    dataset_values = [d.quantity for d in data]

    return {
        "labels": labels,
        "datasets": [
            {
                "name": "Stock Quantity",
                "values": dataset_values
            }
        ]
    }