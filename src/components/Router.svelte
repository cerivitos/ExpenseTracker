<script>
  import { view, overlay } from "../store/store";

  /**Renderless component to act as a simple router using the History API
   *On browser load, parse the url and extract parameters
   */
  window.onload = function() {
    const page = window.location.search.replace("?page=");
    if (page === "dashboard" || page === "settings") {
      view.set(page);
      overlay.set("");
    } else if (page === "detail" || page === "entry") {
      overlay.set(page);
    } else {
      view.set("dashboard");
      overlay.set("");
    }
  };

  /**
   * Handle broswer back events here
   */
  window.onpopstate = function(event) {
    const page = window.location.search.replace("?page=");
    if (page === "dashboard" || page === "settings") {
      view.set(page);
      overlay.set("");
    } else if (page === "detail" || page === "entry") {
      overlay.set(page);
    } else {
      view.set("dashboard");
      overlay.set("");
    }
  };
</script>
