class Chart {
  constructor(ctx, config) {
    this.ctx = ctx
    this.config = config

    // Basic implementation to avoid errors.  A real chart library would do much more.
    this.render = () => {
      console.log("Rendering chart with config:", config)
    }

    this.destroy = () => {
      console.log("Destroying chart")
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // open post popup
  const openPostBtn = document.getElementById("open-posts");
  const postPopupBg = document.getElementById("post-container-bg");
  const popupCloseBtn = document.getElementById("post-popup-close-btn");
  openPostBtn.addEventListener("click", ()=> {
    if(postPopupBg.style.display === 'none') {
      postPopupBg.style.display = 'flex';
    }else {
      postPopupBg.style.display = 'none';
    }
  })
  popupCloseBtn.addEventListener("click", ()=> {
    if(postPopupBg.style.display === 'none') {
      postPopupBg.style.display = 'flex';
    }else {
      postPopupBg.style.display = 'none';
    }
  })
  postPopupBg.addEventListener("click", ()=> {
    postPopupBg.style.display = 'none';
  })
  document.querySelector(".post-container").addEventListener("click", (e)=>{
    e.stopPropagation();
  });

  // Tab navigation
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault()

      // Remove the dark screen
      document.getElementById("absoluteBarToRemoveNavigation").style.display = "none";

      // Remove active class from all nav items
      navItems.forEach((navItem) => {
        navItem.classList.remove("active")
      })

      // Add active class to clicked nav item
      this.classList.add("active")

      // Hide all pages
      const pages = document.querySelectorAll(".page")
      pages.forEach((page) => {
        page.classList.remove("active")
      })

      // Show the selected page
      const pageId = this.getAttribute("data-page") + "-page"
      document.getElementById(pageId).classList.add("active")

      // Close mobile sidebar after navigation
      document.getElementById("sidebar").classList.remove("active")
    })
  })

  // Mobile sidebar toggle
  // Get elements once and store them in variables
  const mobileToggle = document.getElementById("mobileToggle");
  const sidebar = document.getElementById("sidebar");
  const toggleIcon = document.getElementById("mobileToggle-icon");
  const absoluteBar = document.getElementById("absoluteBarToRemoveNavigation");

  // Sidebar toggle function
  function toggleSidebar() {
      sidebar.classList.toggle("active");
      toggleIcon.classList.toggle("fa-xmark");

      // Toggle absoluteBar display
      absoluteBar.style.display = sidebar.classList.contains("active") ? "block" : "none";
  }

  // Close sidebar when absoluteBar is clicked
  function closeSidebar() {
      sidebar.classList.remove("active");
      toggleIcon.classList.remove("fa-xmark");
      absoluteBar.style.display = "none";
  }

  // Event Listeners
  mobileToggle.addEventListener("click", toggleSidebar);
  absoluteBar.addEventListener("click", closeSidebar);


  // When click any profile button
  document.querySelectorAll(".profile-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Navigate to profile page
      navItems.forEach((navItem) => {
        navItem.classList.remove("active")
        if (navItem.getAttribute("data-page") === "profile") {
          navItem.classList.add("active")
        }
      });
      // Hide all pages
      const pages = document.querySelectorAll(".page")
      pages.forEach((page) => {
        page.classList.remove("active")
      });
      // Show profile page
      document.getElementById("profile-page").classList.add("active")
    });
  });

  // WHen click any resources-btn open hub page
  document.querySelectorAll(".resources-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Navigate to hub page
      window.location.href = "/hub";
    });
  });

  // Profile tab navigation
  const tabBtns = document.querySelectorAll(".tab-btn")
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all tab buttons
      tabBtns.forEach((tabBtn) => {
        tabBtn.classList.remove("active")
      })

      // Add active class to clicked tab button
      this.classList.add("active")

      // Hide all tab content
      const tabContents = document.querySelectorAll(".tab-content")
      tabContents.forEach((content) => {
        content.classList.remove("active")
      })

      // Show the selected tab content
      const tabId = this.getAttribute("data-tab") + "-tab"
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Chart filter buttons
  const filterBtns = document.querySelectorAll(".filter-btn")
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all filter buttons
      filterBtns.forEach((filterBtn) => {
        filterBtn.classList.remove("active")
      })

      // Add active class to clicked filter button
      this.classList.add("active")
    })
  })

  // Time filter buttons
  const timeFilters = document.querySelectorAll(".time-filter")
  timeFilters.forEach((filter) => {
    filter.addEventListener("click", function () {
      // Remove active class from all time filters
      timeFilters.forEach((timeFilter) => {
        timeFilter.classList.remove("active")
      })

      // Add active class to clicked time filter
      this.classList.add("active")
    })
  })
})
