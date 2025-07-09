// frappe.pages['meeting-notes-dashboard'].on_page_load = function(wrapper) {
// 	var page = frappe.ui.make_app_page({
// 		parent: wrapper,
// 		title: 'Meeting Notes Dashboard',
// 		single_column: true
// 	});

// 	frappe.call({
//         method: "frappe.client.get_list",
//         args: {
//             doctype: "Meeting Note",
//             fields: ["meeting_title", "meeting_date", "agenda"],
//             order_by: "creation desc",
//             limit: 1
//         },
//         callback: function(response) {
//             const notes = response.message;
//             if (notes && notes.length > 0) {
//                 const note = notes[0];
//                 $(wrapper).find('.layout-main-section').html(`
//                     <h4>${note.meeting_title}</h4>
//                     <p><strong>Date:</strong> ${frappe.datetime.str_to_user(note.meeting_date)}</p>
//                     <p><strong>Agenda:</strong> ${note.agenda}</p>
//                 `);
//             } else {
//                 $(wrapper).find('.layout-main-section').html("<p>No meeting notes found for today.</p>");
//             }
//         }
//     });
// }
// At the very top of meeting_notes_dashboard.js
frappe.provide('frappe.pages'); // This ensures frappe.pages exists as an object

// It's also good practice if this script is DEFINING the page, to initialize its own entry:
// if (!frappe.pages['meeting-notes-dashboard']) {
//  frappe.pages['meeting-notes-dashboard'] = {};
// }
// However, if this script is meant to attach to an *already declared* Page doctype,
// the .on_page_load implies the page object should already be somewhat known by Frappe routing.
// The primary issue is frappe.pages itself being undefined.

// Your existing code:
frappe.pages['meeting-notes-dashboard'].on_page_load = function(wrapper) {
    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Meeting Notes Dashboard', // Consider making this translatable: __('Meeting Notes Dashboard')
        single_column: true
    });

    // Clear the section before adding new content
    const notes_container = $(page.main_section).empty();

    frappe.call({
        method: "frappe.client.get_list", // Standard method for fetching lists
        args: {
            doctype: "Meeting Note", // MAKE SURE you have a Doctype named "Meeting Note"
            fields: ["name", "meeting_title", "meeting_date", "agenda", "notes"],
            order_by: "creation desc",
            limit: 10 // Or however many you want
        },
        callback: function(response) {
            if (response.message && response.message.length > 0) {
                const notes = response.message;
                notes.forEach(note => {
                    // Sanitize content before injecting if it can come from user input elsewhere
                    let note_html = `
                        <div class="meeting-note-entry" style="margin-bottom: 20px; padding: 15px; border: 1px solid #d1d8dd; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                            <h3>${frappe.utils.escape_html(note.meeting_title || note.name)}</h3>
                            <p><strong>Date:</strong> ${note.meeting_date ? frappe.datetime.str_to_user(note.meeting_date) : 'N/A'}</p>
                            <p><strong>Agenda:</strong><br>${frappe.utils.escape_html(note.agenda || 'N/A').replace(/\n/g, '<br>')}</p>
                            <div><strong>Notes:</strong><br>${frappe.utils.escape_html(note.notes || 'N/A').replace(/\n/g, '<br>')}</div>
                        </div>
                    `;
                    notes_container.append(note_html);
                });
            } else {
                notes_container.html("<p>No meeting notes found.</p>");
            }
        },
        error: function(err) {
            notes_container.html("<p>Error loading meeting notes.</p>");
            console.error("Error fetching meeting notes:", err);
        }
    });
};