export function debounce(fn, wait, callFirst) {
  var timeout;
  return function() {
    if (!wait) {
      return fn.apply(this, arguments);
    }
    var context = this;
    var args = arguments;
    var callNow = callFirst && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!callNow) {
        return fn.apply(context, args);
      }
    }, wait);

    if (callNow) {
      return fn.apply(this, arguments);
    }
  };
}

export function handleRouting(newPage) {
  window.history.pushState(
    {
      page: newPage
    },
    null,
    newPage === "" ? "" : "?" + newPage
  );
}

export function convertRemToPixels(rem) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export const typeDesigns = [
  {
    type: "Food",
    hue: 250,
    materialIcon: "restaurant"
  },
  {
    type: "Groceries",
    hue: 230,
    materialIcon: "local_grocery_store"
  },
  {
    type: "Transport",
    hue: 210,
    materialIcon: "directions_transit"
  },
  {
    type: "Household",
    hue: 190,
    materialIcon: "house"
  },
  {
    type: "Entertainment",
    hue: 170,
    materialIcon: "local_movies"
  },
  {
    type: "Healthcare",
    hue: 150,
    materialIcon: "local_hospital"
  },
  {
    type: "Utilities",
    hue: 130,
    materialIcon: "router"
  },
  {
    type: "Shopping",
    hue: 110,
    materialIcon: "shopping_basket"
  },
  {
    type: "Travel",
    hue: 90,
    materialIcon: "airplanemode_active"
  },
  {
    type: "Gift",
    hue: 70,
    materialIcon: "card_giftcard"
  },
  {
    type: "Others",
    hue: 50,
    materialIcon: "format_list_bulleted"
  }
];
