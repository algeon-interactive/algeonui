// In apps/algeon_ui/algeon_ui/algeon_ui/dashboard_chart_source/product_stock_by_warehouse/product_stock_by_warehouse.js

frappe.provide('frappe.dashboards.chart_sources');

// The key here MUST match the "Kaynak Adı" (Source Name) of your Dashboard Chart Source record.
frappe.dashboards.chart_sources['Product Stock by Warehouse'] = {
    // This 'method' property IS CRITICAL for convention-based Python sources.
    // It tells the client-side utilities which Python method to call on the backend.
    // The path should be: app_name.path.to.module.filename.function_name
    method: "algeon_ui.algeon_ui.dashboard_chart_source.product_stock_by_warehouse.product_stock_by_warehouse.get_data",

    filters: [
        {
            fieldname: 'warehouse',
            label: __('Warehouse'),
            fieldtype: 'Link',
            options: 'Warehouse',
        }
    ]
    // No explicit get_data function here in JS, as we want to use the Python one.
};