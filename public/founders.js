// Page Fondateurs APSL — module indépendant
function foundersPageV2(){
  return pageShell(`
    <section class="founders-hero">
      <div class="shell founders-hero-inner">
        <div>
          <div class="kicker">Aux origines de l’APSL</div>
          <h1>Les fondateurs de l’APSL</h1>
          <p>Sept passionnés ont participé à la création de l’Association des Pilotes du Saguenay–Lac-Saint-Jean en 1989.</p>
        </div>
      </div>
    </section>

    <section class="founders-stage">
      <div class="shell founders-stage-grid">
        <div class="stone-wall" aria-label="Plaque des fondateurs de l'APSL">
          <div class="bronze-plaque">
            <span class="plaque-screw screw-tl"></span>
            <span class="plaque-screw screw-tr"></span>
            <span class="plaque-screw screw-bl"></span>
            <span class="plaque-screw screw-br"></span>

            <div class="plaque-inner">
              <div class="plaque-title">Les 7 fondateurs</div>
              <div class="plaque-rule"></div>
              <div class="plaque-subtitle">Précurseurs de l’Association des Pilotes<br>du Saguenay–Lac-Saint-Jean</div>
              <div class="plaque-names">
                ${founders.map(n=>`<div>${esc(n)}</div>`).join('')}
              </div>
              <div class="plaque-rule plaque-rule-bottom"></div>
              <div class="plaque-year">Association créée en 1989</div>
            </div>
          </div>
        </div>

        <aside class="founders-story">
          <div class="eyebrow">Un héritage vivant</div>
          <h2>Reconnaître ceux qui ont lancé l’aventure.</h2>
          <p>Cette plaque reprend l’esprit d’une plaque inaugurale que l’on pourrait retrouver dans un aéroclub ou à l’entrée d’un bâtiment. Elle souligne simplement les personnes à l’origine de l’APSL.</p>

          <div class="founder-facts">
            <div class="founder-fact"><strong>1989</strong><span>Création de l’APSL</span></div>
            <div class="founder-fact"><strong>7</strong><span>membres fondateurs</span></div>
            <div class="founder-fact"><strong>Saint-Honoré</strong><span>ancrage de l’association</span></div>
          </div>
        </aside>
      </div>
    </section>

    <section class="section tint">
      <div class="shell">
        <div class="section-head"><div><div class="eyebrow">Quelques repères</div><h2>Une association née pour rassembler</h2></div></div>
        <div class="timeline">
          <div class="timeline-item"><div class="timeline-year">1989</div><div><h3>Création de l’APSL</h3><p>L’association voit le jour avec l’objectif de rassembler les passionnés d’aviation du Saguenay–Lac-Saint-Jean.</p></div></div>
          <div class="timeline-item"><div class="timeline-year">CYRC</div><div><h3>Ancrage à Saint-Honoré</h3><p>L’APSL s’inscrit dans la vie aéronautique régionale autour de l’aéroport de Saint-Honoré.</p></div></div>
          <div class="timeline-item"><div class="timeline-year">Aujourd’hui</div><div><h3>Une communauté toujours active</h3><p>Avion, hydravion, planeur, simulateur, autogyre, drone, formation et activités sociales composent désormais la vie de l’association.</p></div></div>
        </div>
      </div>
    </section>
  `);
}

if (typeof routes !== 'undefined') {
  routes['/fondateurs'] = foundersPageV2;
  if ((location.hash.replace(/^#/, '') || '/') === '/fondateurs' && typeof render === 'function') render();
}
