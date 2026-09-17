(function () {
  function copyText(value) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(value);
    }

    var input = document.createElement("textarea");
    input.value = value;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.left = "-9999px";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
    return Promise.resolve();
  }

  document.addEventListener("click", function (event) {
    var button = event.target && event.target.closest ? event.target.closest("[data-wechat-copy]") : null;
    if (!button) return;

    event.preventDefault();
    var id = button.getAttribute("data-wechat-copy") || "Longwang1918";
    var original = button.getAttribute("data-copy-label") || button.textContent || "WeChat";
    var originalHtml = button.getAttribute("data-copy-html") || button.innerHTML;
    var copied = button.getAttribute("data-copied-label") || "Copied";
    button.setAttribute("data-copy-html", originalHtml);

    copyText(id).then(function () {
      button.classList.add("copied");
      button.textContent = copied;
      window.clearTimeout(button._wechatTimer);
      button._wechatTimer = window.setTimeout(function () {
        button.classList.remove("copied");
        button.innerHTML = originalHtml || original;
      }, 1600);
    });
  });
})();
