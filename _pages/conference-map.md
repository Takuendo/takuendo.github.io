---
title: "Conference Map"
permalink: /conference-map/
layout: single
classes: wide
---

<div class="conference-map-page">

  <div class="conference-map-intro">
    <h1>Conference Map</h1>
    <p>
      Conferences and places I have visited during my research journey.
      Click a location to see photos and details.
    </p>
  </div>

  <div id="conference-map"></div>

  <div id="conference-card" class="conference-card" aria-live="polite">
    <button
      id="conference-card-close"
      class="conference-card-close"
      aria-label="Close"
      type="button"
    >
      ×
    </button>

    <div id="conference-card-content"></div>
  </div>

</div>

<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script>
  const conferences = {{ site.data.conferences | jsonify }};

  const map = L.map("conference-map", {
    worldCopyJump: true,
    minZoom: 2,
    maxZoom: 18
  }).setView([35, 10], 2);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }
  ).addTo(map);

  const markers = [];

  function showConference(conference) {
    const card = document.getElementById("conference-card");
    const content = document.getElementById("conference-card-content");

    const photos = (conference.photos || [])
      .map(photo => `
        <figure class="conference-photo">
          <img
            src="${photo.src}"
            alt="${photo.alt || conference.name}"
            loading="lazy"
          >
          ${photo.caption
            ? `<figcaption>${photo.caption}</figcaption>`
            : ""}
        </figure>
      `)
      .join("");

    content.innerHTML = `
      <div class="conference-card-header">
        <div>
          <h2>${conference.name}</h2>
          <p class="conference-location">
            ${conference.city}, ${conference.country}
          </p>
        </div>

        <span class="conference-year">
          ${conference.year}
        </span>
      </div>

      <p class="conference-title">
        ${conference.title || ""}
      </p>

      ${
        conference.date
          ? `<p class="conference-date">${conference.date}</p>`
          : ""
      }

      <div class="conference-photos">
        ${photos}
      </div>

      ${
        conference.post
          ? `
            <a
              class="conference-post-link"
              href="${conference.post}"
            >
              Read the conference post →
            </a>
          `
          : ""
      }
    `;

    card.classList.add("is-visible");
  }

  function hideConference() {
    document
      .getElementById("conference-card")
      .classList.remove("is-visible");
  }

  document
    .getElementById("conference-card-close")
    .addEventListener("click", hideConference);

  conferences.forEach(conference => {

    const marker = L.circleMarker(
      [conference.lat, conference.lon],
      {
        radius: 7,
        weight: 2,
        fillOpacity: 0.9,
        color: "#ffffff"
      }
    );

    marker.addTo(map);

    marker.on("click", () => {
      showConference(conference);
    });

    markers.push(marker);
  });

  // Close the card when clicking outside it.
  map.on("click", () => {
    hideConference();
  });
</script>

<style>

.conference-map-page {
  position: relative;
}

.conference-map-intro {
  max-width: 800px;
  margin-bottom: 1.5rem;
}

.conference-map-intro h1 {
  margin-bottom: 0.5rem;
}

.conference-map-intro p {
  color: #666;
  margin-top: 0;
}

#conference-map {
  width: 100%;
  height: 700px;
  min-height: 500px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 2rem;
}

/* Conference marker */

.leaflet-interactive {
  cursor: pointer;
}

/* Floating conference card */

.conference-card {
  position: absolute;
  z-index: 1000;

  top: 90px;
  right: 24px;

  width: 390px;
  max-width: calc(100% - 48px);

  background: #fff;

  border-radius: 8px;

  box-shadow:
    0 10px 35px rgba(0, 0, 0, 0.18);

  overflow: hidden;

  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);

  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    visibility 0.2s ease;
}

.conference-card.is-visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.conference-card-close {
  position: absolute;

  top: 10px;
  right: 10px;

  z-index: 2;

  width: 32px;
  height: 32px;

  border: 0;
  border-radius: 50%;

  background: rgba(0, 0, 0, 0.55);
  color: #fff;

  font-size: 24px;
  line-height: 28px;

  cursor: pointer;
}

#conference-card-content {
  padding: 0 0 20px;
}

.conference-card-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  padding: 22px 50px 0 22px;
}

.conference-card-header h2 {
  margin: 0;
}

.conference-location {
  margin: 3px 0 0;
  color: #777;
}

.conference-year {
  font-weight: 600;
  white-space: nowrap;
}

.conference-title {
  padding: 0 22px;
  margin: 12px 0 4px;

  font-size: 0.9rem;
  line-height: 1.5;
}

.conference-date {
  padding: 0 22px;
  margin: 0 0 14px;

  font-size: 0.85rem;
  color: #777;
}

.conference-photos {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;

  padding: 0 12px;
}

.conference-photo {
  margin: 0;
}

.conference-photo img {
  display: block;

  width: 100%;
  aspect-ratio: 4 / 3;

  object-fit: cover;

  border-radius: 4px;
}

.conference-photo figcaption {
  padding: 5px 2px;

  font-size: 0.72rem;
  line-height: 1.3;

  color: #777;
}

.conference-post-link {
  display: inline-block;

  margin: 15px 22px 0;

  font-weight: 600;
}

/* Mobile */

@media (max-width: 700px) {

  #conference-map {
    height: 600px;
  }

  .conference-card {
    top: auto;
    right: 10px;
    bottom: 20px;
    left: 10px;

    width: auto;
    max-width: none;

    max-height: 70vh;
    overflow-y: auto;
  }

  .conference-card-header {
    padding-top: 18px;
  }

}

</style>
