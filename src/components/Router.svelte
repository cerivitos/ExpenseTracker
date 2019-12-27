<script>
  import { view } from "../store/store";

  /**Renderless component to act as a simple router using the History API
   *On browser load, parse the url and extract parameters
   */
  window.onload = function() {
    if (window.location.search.length > 0) {
      const params = window.location.search.substr(1);
      const page = params.split("=")[1];
      view.set(page);
    }
  };

  /**
   * Handle broswer back events here
   */
  window.onpopstate = function(event) {
    if (event.state) {
      view.set(event.state.page);
    } else {
      view.set("dashboard");
    }
  };
</script>
