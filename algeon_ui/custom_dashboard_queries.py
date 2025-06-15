import frappe

def get_distinct_item_count_per_warehouse():
    data = frappe.db.sql("""
        SELECT
            warehouse,
            COUNT(DISTINCT item_code) AS item_count
        FROM
            `tabBin`
        WHERE
            actual_qty > 0
        GROUP BY
            warehouse
        ORDER BY
            item_count DESC
    """, as_dict=True) # as_dict=True is convenient for charts
    return data

def get_total_stock_quantity_per_warehouse():
    data = frappe.db.sql("""
        SELECT
            warehouse,
            SUM(actual_qty) AS total_quantity
        FROM
            `tabBin`
        WHERE
            actual_qty > 0
        GROUP BY
            warehouse
        ORDER BY
            total_quantity DESC
    """, as_dict=True)
    return data