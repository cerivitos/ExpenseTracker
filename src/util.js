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

export function getDateString(year, month, date) {
  let _year, _month, _date;

  if (year) {
    _year = year;
  } else {
    _year = new Date().getFullYear();
  }

  if (month) {
    _month = month;
  } else {
    _month = new Date().getMonth() + 1;
  }
  if (_month < 10) _month = _month.toString().padStart(2, "0");

  if (date) {
    _date = date;
  } else {
    _date = new Date().getDate();
  }
  if (date < 10) _date = _date.toString().padStart(2, "0");

  console.log(_year + "-" + _month + "-" + _date);

  return _year + "-" + _month + "-" + _date;
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
