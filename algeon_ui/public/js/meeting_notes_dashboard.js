frappe.pages['meeting-notes-dashboard'].on_page_load = function(wrapper) {
    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Meeting Notes Dashboard',
        single_column: true
    });

    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Meeting Note",
            fields: ["name", "meeting_title", "meeting_date", "agenda", "notes"],
            order_by: "creation desc",
            limit: 1
        },
        callback: function(response) {
            const notes = response.message;
            if (notes && notes.length > 0) {
                const note = notes[0];
                $(wrapper).find('.layout-main-section').html(`
                    <h4>${note.meeting_title}</h4>
                    <p><strong>Date:</strong> ${frappe.datetime.str_to_user(note.meeting_date)}</p>
                    <p><strong>Agenda:</strong> ${note.agenda}</p>
                    <div><strong>Notes:</strong><br>${note.notes}</div>
                `);
            } else {
                $(wrapper).find('.layout-main-section').html("<p>No meeting notes found for today.</p>");
            }
        }
    });
};
