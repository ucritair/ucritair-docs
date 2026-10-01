// CAT owner's manual: theme toggle, mobile navigation, screenshot lightbox.
(function () {
	"use strict";

	var root = document.documentElement;

	function storedTheme() {
		try { return localStorage.getItem("cat-manual-theme"); } catch (e) { return null; }
	}
	function storeTheme(value) {
		try { localStorage.setItem("cat-manual-theme", value); } catch (e) { /* private window */ }
	}
	function effectiveTheme() {
		var t = root.getAttribute("data-theme");
		if (t) return t;
		return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}

	var saved = storedTheme();
	if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);

	document.addEventListener("DOMContentLoaded", function () {
		var toggle = document.querySelector("[data-theme-toggle]");
		function label() {
			if (!toggle) return;
			var dark = effectiveTheme() === "dark";
			toggle.textContent = dark ? "Light" : "Dark";
			toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
		}
		if (toggle) {
			label();
			toggle.addEventListener("click", function () {
				var next = effectiveTheme() === "dark" ? "light" : "dark";
				root.setAttribute("data-theme", next);
				storeTheme(next);
				label();
			});
		}

		var menu = document.querySelector("[data-menu-toggle]");
		if (menu) {
			menu.addEventListener("click", function () {
				var open = document.body.classList.toggle("nav-open");
				menu.setAttribute("aria-expanded", open ? "true" : "false");
			});
			document.querySelectorAll(".sidebar a").forEach(function (a) {
				a.addEventListener("click", function () {
					document.body.classList.remove("nav-open");
					menu.setAttribute("aria-expanded", "false");
				});
			});
		}

		// Lightbox: every screenshot opens at full size.
		var box = document.createElement("div");
		box.className = "lightbox";
		box.setAttribute("role", "dialog");
		box.setAttribute("aria-modal", "true");
		box.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure>';
		document.body.appendChild(box);
		var boxImg = box.querySelector("img");
		var boxCap = box.querySelector("figcaption");
		var lastFocus = null;

		function close() {
			box.classList.remove("open");
			if (lastFocus) lastFocus.focus();
		}
		box.addEventListener("click", close);
		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape" && box.classList.contains("open")) close();
		});

		document.querySelectorAll(".device").forEach(function (btn) {
			btn.addEventListener("click", function () {
				var img = btn.querySelector("img");
				var cap = btn.closest("figure") && btn.closest("figure").querySelector("figcaption");
				boxImg.src = img.src;
				boxImg.alt = img.alt;
				boxCap.textContent = cap ? cap.textContent : img.alt;
				lastFocus = btn;
				box.classList.add("open");
			});
		});
	});
})();
