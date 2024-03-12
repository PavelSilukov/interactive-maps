var map = L.map("map").setView([55.79461930098452, 49.10762497960837], 12);

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

var OPNVKarte = L.tileLayer(
  "https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png"
);
osm.addTo(map);

var YaMaps = L.yandex("yandex#map");

var homeIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-building" viewBox="0 0 16 16">
  <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1ZM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Z"/>
  <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V1Zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3V1Z"/>
  </svg>`,
  className: "",
});

var Home = L.marker([55.77395631817703, 49.13611960925349], {icon: homeIcon}).addTo(map);


function makeFullScreen() {
  var divObj = document.getElementById("image");
  //Use the specification method before using prefixed versions
  if (divObj.requestFullscreen) {
    divObj.requestFullscreen();
  } else if (divObj.msRequestFullscreen) {
    divObj.msRequestFullscreen();
  } else if (divObj.mozRequestFullScreen) {
    divObj.mozRequestFullScreen();
  } else if (divObj.webkitRequestFullscreen) {
    divObj.webkitRequestFullscreen();
  } else {
    console.log("Fullscreen API is not supported");
  }
}

function On(a) {
  a.style.width = "500px"; //На параметр а вешаем событие - увеличение размера
}
function Off(a) {
  a.style.width = "100px"; //вешаем на а другое событие - возврат к исходному
}

var arr = pointJson.features;

console.log(arr);

function Places() {
  const ul = document.querySelector(".list");
  pointJson.forEach((f) => {
    f.features.forEach((e) => {
      const li = document.createElement("li");
      const div = document.createElement("div");
      const a = document.createElement("a");
      const img = document.createElement("img");
      a.addEventListener("click", () => {
        flyToPoint(e);
      });
      console.log(e.properties.Name);
      div.classList.add("point-item");
      a.innerText = e.properties.Name;
      a.href = "#";

      img.src = "./img/" + e.properties.OBJECTID + ".jpg";
      img.width = 430;
      div.appendChild(a);
      div.appendChild(img);
      li.appendChild(div);
      ul.appendChild(li);
    });
  });
}
Places();

function flyToPoint(point) {
  const lat = point.geometry.coordinates[1];
  const lng = point.geometry.coordinates[0];
  map.flyTo([lat, lng], 15, {
    duration: 2,
  });
  setTimeout(() => {
    L.popup({
      closeButton: false,
      offset: L.point(0, -8),
      maxWidth: 400,
      keepInView: true,
      closeButton: false,
    })
      .setLatLng([lat, lng])
      .setContent(makePopupcontent(point))
      .openOn(map);
  }, 2000);
}

function filter_building(feature) {
  if (feature.properties.Type === 1) return true;
}
function filter_museum(feature) {
  if (feature.properties.Type === 2) return true;
}
function filter_area(feature) {
  if (feature.properties.Type === 3) return true;
}
function filter_nature(feature) {
  if (feature.properties.Type === 4) return true;
}

function onEachFeatureEat(feature, layer) {
  layer.bindPopup(
    "<h6>" +
      feature.id +
      "<b>" +
    "<h6>" +
      feature.properties.Type +
      ": " +
      feature.properties.Name +
      "<h6>" +
      feature.properties.Desc +
      "<h6>" +
      "<b>Рейтинг: " +
      feature.properties.Rat +
      "<b>" +
      "</br>" +
      "<h6>Телефон: " +
      feature.properties.Tel +
      "</h6>" +
      "<a target='_blank' href=" +
      feature.properties.Desc_ +
      ">" +
      feature.properties.Desc_ +
      "</a>",

    {
      maxWidth: 600,
      keepInView: true,
    }
  );
  layer.on({
    click: function (e) {
      var latlng = e.target.getLatLng();
      var lat = latlng.lat - 1;
      console.log(lat);
      map.setView([latlng.lat, latlng.lng]);
    },
  });
}

function speak() {
  let text = document.getElementById('Text').innerText;
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}
function stopSpeak() {
  speechSynthesis.pause();
}

function contSpeak() {
  speechSynthesis.resume();
}


function makePopupcontent(feature) {
  var img_id = "./img/" + feature.properties.OBJECTID + ".jpg";
  var text = feature.properties.Desc;
  return `<div>
      <h4 >${feature.properties.Name}</h4>
      <p id="Text">${feature.properties.Desc}</p>
      </div>
      <img id="image" src=${img_id} onClick="makeFullScreen()"></img>
      <button class="btn btn-primary" onclick="speak();"></button>
      <button class="btn btn-primary" onclick="stopSpeak();"></button>
      <button class="btn btn-primary" onclick="contSpeak();"></button>`
}

function onEachFeature(feature, layer) {
  layer.bindPopup(makePopupcontent(feature), {
    maxWidth: 400,
    keepInView: true,
    closeButton: false,
  });
  layer.on({
    click: function (e) {
      var latlng = e.target.getLatLng();
      var lat = latlng;
      console.log(lat);
      map.setView([latlng.lat, latlng.lng]);
    },
  });
}

const KafeIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 128 128"><path d="M64 39.43a11.12 11.12 0 0 0-10.92 9.1h21.84A11.12 11.12 0 0 0 64 39.43zM77.5 52.53h-27a.74.74 0 0 0 0 1.47h27a.74.74 0 0 0 0-1.47zM64.27 110a11.63 11.63 0 0 1-7.83-3.27c-11.85 1.09-16.65 4.31-16.65 5.52 0 1.75 8.23 5.85 24.21 5.85s24.21-4.1 24.21-5.85c0-1.21-4.89-4.43-16.74-5.52a8.85 8.85 0 0 1-7.2 3.27zM65.05 34.38a1.05 1.05 0 1 0-2.1 0v1h2.1z"/><path d="M64 9.93a33.85 33.85 0 0 0-33.81 33.81c0 9.89 10.36 31.49 28.43 59.27l.05.08a6.36 6.36 0 0 0 10.66 0v-.08c18.12-27.78 28.48-49.38 28.48-59.27A33.85 33.85 0 0 0 64 9.93zM77.5 58h-27a4.74 4.74 0 0 1-1.5-9.23A15.12 15.12 0 0 1 59 36.3v-1.92a5 5 0 1 1 10.1 0v1.92A15.12 15.12 0 0 1 79 48.77 4.74 4.74 0 0 1 77.5 58z" fill="#D2691E"/></svg>`,
  className: "",
  iconSize: [30, 40],
  iconAnchor: [12, 40],
});

const BuildIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#DC143C" class="bi bi-geo-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/>
</svg>`,
  className: "",
});

const MuseumIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#C71585" class="bi bi-geo-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/>
</svg>`,
  className: "",
  iconSize: [30, 40],
  iconAnchor: [12, 40],
});

const AreaIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#483D8B" class="bi bi-geo-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/>
</svg>`,
  className: "",
  iconSize: [30, 40],
  iconAnchor: [12, 40],
});

const NatureIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#006400" class="bi bi-geo-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/>
</svg>`,
  className: "",
  iconSize: [30, 40],
  iconAnchor: [12, 40],
});

var eda = L.geoJSON(kafeJSON, {
  pointToLayer: function (geometry, coordinates) {
    return L.marker(coordinates, { icon: KafeIcon });
  },
  onEachFeature: onEachFeatureEat,
});

var buildings = L.geoJSON(pointJson, {
  filter: filter_building,
  pointToLayer: function (geometry, coordinates) {
    return L.marker(coordinates, { icon: BuildIcon });
  },
  onEachFeature: onEachFeature,
});

var museums = L.geoJSON(pointJson, {
  filter: filter_museum,
  pointToLayer: function (geometry, coordinates) {
    return L.marker(coordinates, { icon: MuseumIcon });
  },
  onEachFeature: onEachFeature,
});

var areas = L.geoJSON(pointJson, {
  filter: filter_area,
  pointToLayer: function (geometry, coordinates) {
    return L.marker(coordinates, { icon: AreaIcon });
  },
  onEachFeature: onEachFeature,
});

var natures = L.geoJSON(pointJson, {
  filter: filter_nature,
  pointToLayer: function (geometry, coordinates) {
    return L.marker(coordinates, { icon: NatureIcon });
  },
  onEachFeature: onEachFeature,
});

var baseMaps = {
  OSM: osm,
  Yandex: YaMaps,
  Transport: OPNVKarte,
};

var clusterBuid = L.markerClusterGroup();
clusterBuid.addLayer(buildings);
clusterBuid.addTo(map);

var clusterMuseum = L.markerClusterGroup();
clusterMuseum.addLayer(museums);

var clusterAreas = L.markerClusterGroup();
clusterAreas.addLayer(areas);

var clusterNature = L.markerClusterGroup();
clusterNature.addLayer(natures);

var Places = {
  Архитектура: clusterBuid,
  Музеи: clusterMuseum,
  Пространства: clusterAreas,
  Природа: clusterNature,
  Поесть: eda,
};


L.control.navbar().addTo(map);
L.control.layers(baseMaps, Places, { collapsed: false }).addTo(map);



//speak();
