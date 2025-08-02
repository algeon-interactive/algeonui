// Custom Tabbed Workspace Navigation for Frappe/ERPNext Desk
// Injected by algeon_ui app

(function() {
    // Set of route prefixes that indicate a sub-page (not a main workspace)
    const SUBPAGE_PREFIXES = new Set([
        "List", "Form", "Report", "Tree", "dashboard", "print", "query-report"
    ]);

    // Global state to track open tabs
    let openTabs = {}; // { workspaceKey: { label, route, key }, ... }
    let currentWorkspace = null;
    let forceSwitchToWorkspace = null; // Used to force navigation to a new tab

    // Ensure the custom tabs container exists in the DOM
    function ensureTabBar() {
        if (document.getElementById("custom-tab-bar")) return;
        // Always inject after the main Frappe navbar/header
        let navbar = document.querySelector(".navbar, .navbar-expand, header.navbar");
        const tabBar = document.createElement("div");
        tabBar.id = "custom-tab-bar";
        tabBar.innerHTML = `<ul class="nav nav-tabs" id="custom-tabs-list" style="margin-bottom:0;"></ul>`;
        if (navbar && navbar.parentNode) {
            navbar.insertAdjacentElement("afterend", tabBar);
        } else {
            // Fallback: insert at top of body
            document.body.insertBefore(tabBar, document.body.firstChild);
        }
    }

    // Helper to get translated label for a tab based on route
    function getTabLabel(tabInfo) {
        let route = tabInfo.route;
        if (!route || route.length === 0) return __(tabInfo.label || "");
        // List: Doctype + Listesi
        if (route[0] === "List" && route.length >= 2) {
            return __(route[1]) + " " + __("Listesi");
        }
        // Report: Doctype + Raporu
        if (route[0] === "Report" && route.length >= 2) {
            return __(route[1]) + " " + __("Raporu");
        }
        // Form: show last child (usually document name)
        if (route[0] === "Form" && route.length >= 3) {
            return __(route[route.length - 1]);
        }
        // Other: show last child
        return __(route[route.length - 1]);
    }

    // Render the tabs in the UI based on openTabs, with close and plus buttons
    function renderTabs() {
        ensureTabBar();
        const list = document.getElementById("custom-tabs-list");
        if (!list) return;
        list.innerHTML = "";
        // Render tabs
        for (const workspace in openTabs) {
            const tabInfo = openTabs[workspace];
            const activeClass = (workspace === currentWorkspace) ? "active" : "";
            const li = document.createElement("li");
            li.className = "nav-item custom-tab-item";
            // Tab label with close button
            li.innerHTML = `<a class="nav-link ${activeClass}" href="#" data-workspace="${workspace}">
                <span class="tab-label">${getTabLabel(tabInfo)}</span>
                <span class="tab-close" data-close-workspace="${workspace}" title="${__("Kapat")}">&times;</span>
            </a>`;
            list.appendChild(li);
        }
        // Add the + button at the end, right-aligned
        let plusLi = document.createElement("li");
        plusLi.className = "nav-item custom-tab-plus";
        plusLi.innerHTML = `<a class="nav-link" href="#" id="custom-tab-add" title="${__("Yeni Sekme")}">+</a>`;
        list.appendChild(plusLi);
        // Flex styling for right alignment
        list.style.display = "flex";
        list.style.justifyContent = "flex-start";
        plusLi.style.marginLeft = "auto";
    }

    // Add or switch to a workspace tab
    function handleWorkspaceNavigation(workspace, initialRoute, initialLabel) {
        // If this is a forced switch (from new tab), use the forced key
        let workspaceKey = forceSwitchToWorkspace || workspace;
        forceSwitchToWorkspace = null;
        if (!openTabs[workspaceKey]) {
            openTabs[workspaceKey] = {
                label: initialLabel || workspace,
                route: initialRoute || [workspace],
                key: workspaceKey
            };
        }
        currentWorkspace = workspaceKey;
        renderTabs();
    }

    // Update the current tab's route when navigating within a workspace
    function updateCurrentTabRoute(route) {
        if (!currentWorkspace || !openTabs[currentWorkspace]) return;
        openTabs[currentWorkspace].route = route;
        renderTabs(); // update tab label if needed
    }

    // Handle route changes
    function handleRouteChange() {
        const route = frappe.get_route();
        if (!route || route.length === 0) return;
        const first = route[0];
        // Only update the route for the current tab
        if (currentWorkspace && openTabs[currentWorkspace]) {
            openTabs[currentWorkspace].route = route;
        }
        renderTabs(); // update tab label if needed
    }

    // Activate tab switching, closing, and new tab (+) button
    document.addEventListener("click", function(e) {
        // Close tab
        const closeBtn = e.target.closest(".tab-close");
        if (closeBtn) {
            e.preventDefault();
            const workspace = closeBtn.getAttribute("data-close-workspace");
            if (!workspace || !openTabs[workspace]) return;
            // Remove tab
            delete openTabs[workspace];
            // If closing current tab, switch to another tab (last, or any)
            if (workspace === currentWorkspace) {
                const keys = Object.keys(openTabs);
                if (keys.length > 0) {
                    currentWorkspace = keys[keys.length - 1];
                    const targetRoute = openTabs[currentWorkspace].route;
                    renderTabs();
                    if (Array.isArray(targetRoute)) {
                        frappe.set_route(targetRoute);
                    } else if (typeof targetRoute === 'string') {
                        frappe.set_route(targetRoute);
                    }
                } else {
                    // No tabs left, go to home
                    currentWorkspace = null;
                    renderTabs();
                    frappe.set_route('home');
                }
            } else {
                renderTabs();
            }
            return;
        }
        // Add new tab
        const addBtn = e.target.closest("#custom-tab-add");
        if (addBtn) {
            e.preventDefault();
            // Always create a new unique tab for home and switch to it
            let homeKey = "home";
            let i = 1;
            while (openTabs[homeKey]) {
                homeKey = "home" + (++i);
            }
            openTabs[homeKey] = {
                label: "Ana Sayfa",
                route: ["home"],
                key: homeKey
            };
            currentWorkspace = homeKey;
            renderTabs();
            frappe.set_route('home');
            return;
        }
        // Switch tab
        const target = e.target.closest("#custom-tabs-list .nav-link");
        if (!target) return;
        e.preventDefault();
        const workspace = target.getAttribute("data-workspace");
        if (!workspace || !openTabs[workspace]) return;
        // Always switch to the tab and route in one click
        currentWorkspace = workspace;
        renderTabs();
        const targetRoute = openTabs[workspace].route;
        // Only set route if not already on it
        const currentRoute = frappe.get_route ? frappe.get_route() : [];
        let same = false;
        if (Array.isArray(targetRoute) && Array.isArray(currentRoute)) {
            same = targetRoute.length === currentRoute.length && targetRoute.every((v, i) => v === currentRoute[i]);
        } else if (typeof targetRoute === 'string') {
            same = targetRoute === window.location.hash.replace(/^#\/?/, '');
        }
        if (!same) {
            if (Array.isArray(targetRoute)) {
                frappe.set_route(targetRoute);
            } else if (typeof targetRoute === 'string') {
                frappe.set_route(targetRoute);
            }
        }
    });

    // Run setup after the page is fully loaded
    $(window).on('load', function() {
        // Listen to route changes
        frappe.router.on('change', handleRouteChange);
        // Initial render if already on a workspace
        setTimeout(handleRouteChange, 500);
    });

    // Optional: Add minimal CSS for tab bar integration
    const style = document.createElement('style');
    style.innerHTML = `
        #custom-tab-bar { background: #f8fafc; border-bottom: 1px solid #e2e8f0; z-index: 1001; width: 100%; }
        #custom-tabs-list { align-items: stretch; }
        #custom-tabs-list .nav-link.active { background: #fff; border: 1px solid #e2e8f0; border-bottom: none; color: #1d72b8; }
        #custom-tabs-list .nav-link { color: #495057; display: flex; align-items: center; }
        .tab-label { margin-right: 0.5em; }
        .tab-close { margin-left: 0.25em; cursor: pointer; color: #888; font-size: 1.1em; }
        .tab-close:hover { color: #d00; }
        .custom-tab-plus .nav-link { font-weight: bold; font-size: 1.2em; color: #1d72b8; margin-left: auto; }
        .custom-tab-plus .nav-link:hover { color: #155a8a; background: #f0f4f8; }
    `;
    document.head.appendChild(style);
})();