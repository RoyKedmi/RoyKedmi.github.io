
function initalizeBulmaNavbars() {
    //Copied from bulma site
    document.addEventListener('DOMContentLoaded', () => {

      // Get all "navbar-burger" elements
      const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

      // Check if there are any navbar burgers
      if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach( el => {
          el.addEventListener('click', () => {

            // Get the target from the "data-target" attribute
            const target = el.dataset.target;
            const $target = document.getElementById(target);

            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');

          });
        });
      }

    });
}

var routes = {
                "/": "./mainPage.html",
                "/projects": "./projects/projects.html",
                "/devblog": "./devblog/devblog.html",
             };

var contentDiv = document.getElementById('contentDiv');

function updateContent(filepath) {
    fetch(filepath).then((res) => {
        return res.text();
    }).then((text) => {
        contentDiv.innerHTML = text;
    });
}

function loadContent(pathname) {
    pathname = pathname.replace(/\/+$/, '');
    var filepath = routes[pathname];
    if (!filepath) {
        filepath = routes[pathname + "/"];
    }
    if (!filepath) {
        filepath = routes["/"];
        window.history.replaceState(null, null, "");
    }

    updateContent(filepath);
}

function navigateToItem(pathname) {
    window.history.pushState({}, pathname, window.location.origin + pathname);
    loadContent(pathname);
}

function initalizeSPANavigation() {
    window.onpopstate = () => {
        var pathname = window.location.pathname;
        loadContent(pathname);
    }
}

function main() {
    initalizeBulmaNavbars();
    initalizeSPANavigation();

    var pathname = window.location.pathname;
    loadContent(pathname);
    //navigateToItem(window.location.pathname);
}

main();
