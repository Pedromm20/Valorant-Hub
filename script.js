document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = "https://valorant-api.com/v1";
    const sections = document.querySelectorAll(".tab");
    const navLinks = document.querySelectorAll("a[href^='#']");
    const weaponsContainer = document.getElementById("weapons-container");
    const agentsContainer = document.getElementById("agents-container");
    const mapsContainer = document.getElementById("maps-container");
    const agentDetailSection = document.getElementById("agent-detail");
    const agentDetailContainer = document.getElementById("agent-detail-container");
    const abilityDetailSection = document.getElementById("ability-detail");
    const abilityDetailContainer = document.getElementById("ability-detail-container");
    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu");
    


    // Referencias para detalles de armas y skins
    const weaponDetailSection = document.getElementById("weapon-detail");
    const weaponDetailContainer = document.getElementById("weapon-detail-container");
    const weaponSkinDetailSection = document.getElementById("weapon-skin-detail");
    const weaponSkinDetailContainer = document.getElementById("weapon-skin-detail-container");
    
    // Dark Mode
    
    let themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
    let themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

    // Change the icons inside the button based on previous settings
    if (
        localStorage.getItem("color-theme") === "dark" ||
        (!("color-theme" in localStorage) &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
        themeToggleLightIcon.classList.remove("hidden");
    } else {
        themeToggleDarkIcon.classList.remove("hidden");
    }

    let themeToggleBtn = document.getElementById("theme-toggle");

    themeToggleBtn.addEventListener("click", function () {
        // toggle icons inside button
        themeToggleDarkIcon.classList.toggle("hidden");
        themeToggleLightIcon.classList.toggle("hidden");

        // if set via local storage previously
        if (localStorage.getItem("color-theme")) {
            if (localStorage.getItem("color-theme") === "light") {
                document.documentElement.classList.add("dark");
                localStorage.setItem("color-theme", "dark");
            } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("color-theme", "light");
            }

            // if NOT set via local storage previously
        } else {
            if (document.documentElement.classList.contains("dark")) {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("color-theme", "light");
            } else {
                document.documentElement.classList.add("dark");
                localStorage.setItem("color-theme", "dark");
            }
        }
    });
    
    // Mostrar sección y cargar datos
    const showSection = (targetId) => {
        sections.forEach((section) => {
            section.classList.toggle("hidden", `#${section.id}` !== targetId);
        });

        if (targetId === "#agents") loadAgents();
        if (targetId === "#maps") loadMaps();
        if (targetId === "#weapons") loadWeapons();
    };

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            showSection(targetId);

            // Cerrar menú hamburguesa si está abierto
            if (menu && !menu.classList.contains("hidden")) {
                menu.classList.add("hidden");
            }
        });
    });

    menuToggle?.addEventListener("click", () => {
        menu.classList.toggle("hidden");
    });

    // Inicializar mostrando solo la sección principal
    showSection("#main");

    const loadData = (endpoint, callback) => {
        fetch(`${BASE_URL}/${endpoint}`)
            .then((res) => res.json())
            .then((jsonResponse) => callback(jsonResponse.data))
            .catch((error) => console.error(`Error al cargar ${endpoint}:`, error));
    };

    const animateCardIn = (card) => {
        card.classList.add("opacity-0", "transform", "translate-y-4", "transition-all", "duration-300");
        requestAnimationFrame(() => {
            card.classList.remove("opacity-0", "translate-y-4");
        });
    };

    const loadAgents = () => {
        loadData("agents?isPlayableCharacter=true", (agents) => {
            agentsContainer.innerHTML = "";
            agents.forEach((agent) => {
                const card = document.createElement("div");
                card.className = "bg-gray-800 p-4 rounded-lg text-center cursor-pointer hover:shadow-lg";
                card.innerHTML = `
                    <img src="${agent.displayIcon}" alt="${agent.displayName}" class="w-full h-40 object-cover rounded">
                    <h3 class="text-white font-bold mt-2">${agent.displayName}</h3>
                `;
                card.addEventListener("click", () => showAgentDetail(agent));
                agentsContainer.appendChild(card);
                animateCardIn(card);
            });
        });
    };

    const loadMaps = () => {
        loadData("maps", (maps) => {
            mapsContainer.innerHTML = "";
            maps.forEach((map) => {
                const card = document.createElement("div");
                card.className = "bg-gray-800 p-4 rounded-lg text-center";
                card.innerHTML = `
                    <img src="${map.splash}" alt="${map.displayName}" class="w-full h-40 object-cover rounded">
                    <h3 class="text-white font-bold mt-2">${map.displayName}</h3>
                `;
                mapsContainer.appendChild(card);
                animateCardIn(card);
            });
        });
    };

    const loadWeapons = () => {
        loadData("weapons", (weapons) => {
            weaponsContainer.innerHTML = "";
            weapons.forEach((weapon) => {
                const card = document.createElement("div");
                card.className = "bg-gray-800 p-4 rounded-lg text-center cursor-pointer hover:shadow-lg";
                card.innerHTML = `
                    <img src="${weapon.displayIcon}" alt="${weapon.displayName}" class="w-full h-40 object-cover rounded">
                    <h3 class="text-white font-bold mt-2">${weapon.displayName}</h3>
                `;
                card.addEventListener("click", () => showWeaponDetail(weapon));
                weaponsContainer.appendChild(card);
                animateCardIn(card);
            });
        });
    };

    const showAgentDetail = (agent) => {
        const roleName = agent.role ? agent.role.displayName : "Sin rol";
        const abilitiesHtml = agent.abilities
            .filter((ability) => ability.displayName && ability.displayIcon)
            .map(
                (ability) => `
                <div class="bg-gray-700 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-600 ability-card transition-colors duration-200" data-description="${ability.description}" data-name="${ability.displayName}">
                    <img src="${ability.displayIcon}" alt="${ability.displayName}" class="w-12 h-12 mx-auto">
                    <h4 class="text-white font-bold mt-2">${ability.displayName}</h4>
                </div>
            `
            )
            .join("");
    
        agentDetailContainer.innerHTML = `
            <div class="flex flex-col items-center p-4">
                <img src="${agent.bustPortrait}" alt="${agent.displayName}" class="w-60 h-60 object-cover rounded-lg shadow-lg">
                <h2 class="text-3xl font-bold text-white mt-4">${agent.displayName}</h2>
                <p class="text-gray-300 text-lg mt-2">Rol: ${roleName}</p>
                <p class="text-gray-400 mt-2 text-center">${agent.description}</p>
                <h3 class="text-xl font-bold text-white mt-6">Habilidades</h3>
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    ${abilitiesHtml}
                </div>
            </div>
        `;
    
        agentDetailContainer.querySelectorAll(".ability-card").forEach((card) => {
            card.addEventListener("click", () => {
                const description = card.getAttribute("data-description");
                const name = card.getAttribute("data-name");
                showAbilityDetail(name, description);
            });
        });
    
        agentDetailSection.classList.remove("hidden", "translate-x-full", "opacity-0");
        agentDetailSection.classList.add("translate-x-0", "opacity-100");
    };
    
    const closeAgentDetail = () => {
        agentDetailSection.classList.remove("translate-x-0", "opacity-100");
        agentDetailSection.classList.add("translate-x-full", "opacity-0");
        setTimeout(() => agentDetailSection.classList.add("hidden"), 300); 
    };
    
    document.getElementById("close-detail")?.addEventListener("click", closeAgentDetail);
    
    const showAbilityDetail = (name, description) => {
        abilityDetailContainer.innerHTML = `
            <div class="p-4">
                <h4 class="text-white text-2xl font-bold">${name}</h4>
                <p class="text-gray-300 mt-2">${description}</p>
            </div>
        `;
        abilityDetailSection.classList.remove("hidden", "translate-y-full", "opacity-0");
        abilityDetailSection.classList.add("translate-y-0", "opacity-100");
    };

    const closeAbilityDetail = () => {
        abilityDetailSection.classList.remove("translate-y-0", "opacity-100");
        abilityDetailSection.classList.add("translate-y-full", "opacity-0");
        setTimeout(() => abilityDetailSection.classList.add("hidden"), 300);
    };

    document.getElementById("close-ability-detail")?.addEventListener("click", closeAbilityDetail);

    // Mostrar detalle de un arma (skins)
    const showWeaponDetail = (weapon) => {
        // Cargar skins del arma
        const skins = weapon.skins.filter(skin => skin.displayIcon && skin.displayName);
        const skinsHtml = skins.map(skin => `
            <div class="bg-gray-700 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-600 weapon-skin-card transition-colors duration-200"
                 data-skin='${JSON.stringify(skin)}'>
                <img src="${skin.displayIcon}" alt="${skin.displayName}" class="w-20 h-20 object-cover mx-auto rounded">
                <h4 class="text-white font-bold mt-2 text-sm">${skin.displayName}</h4>
            </div>
        `).join("");

        weaponDetailContainer.innerHTML = `
            <div class="flex flex-col items-center p-4">
                <img src="${weapon.displayIcon}" alt="${weapon.displayName}" class="w-40 h-40 object-cover rounded-lg shadow-lg">
                <h2 class="text-2xl md:text-3xl font-bold text-white mt-4">${weapon.displayName}</h2>
                <p class="text-gray-300 text-center mt-2 text-sm md:text-base">Selecciona una skin para ver detalles.</p>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    ${skinsHtml}
                </div>
            </div>
        `;

        // Evento para mostrar detalle de la skin
        weaponDetailContainer.querySelectorAll(".weapon-skin-card").forEach(card => {
            card.addEventListener("click", () => {
                const skinData = JSON.parse(card.getAttribute("data-skin"));
                showWeaponSkinDetail(skinData);
            });
        });

        weaponDetailSection.classList.remove("hidden", "translate-x-full", "opacity-0");
        weaponDetailSection.classList.add("translate-x-0", "opacity-100");
    };

    const closeWeaponDetail = () => {
        weaponDetailSection.classList.remove("translate-x-0", "opacity-100");
        weaponDetailSection.classList.add("translate-x-full", "opacity-0");
        setTimeout(() => weaponDetailSection.classList.add("hidden"), 300); 
    };

    document.getElementById("close-weapon-detail")?.addEventListener("click", closeWeaponDetail);

    // Mostrar detalle de la skin del arma con imagen y video si existe
const showWeaponSkinDetail = (skin) => {
    // Buscar un video en levels o chromas
    let streamedVideo = null;
    if (skin.levels) {
        const levelWithVideo = skin.levels.find(l => l.streamedVideo);
        if (levelWithVideo) streamedVideo = levelWithVideo.streamedVideo;
    }
    if (!streamedVideo && skin.chromas) {
        const chromaWithVideo = skin.chromas.find(c => c.streamedVideo);
        if (chromaWithVideo) streamedVideo = chromaWithVideo.streamedVideo;
    }

    // Imagen principal
    const mainImage = (skin.chromas && skin.chromas[0].fullRender) 
                      || (skin.levels && skin.levels[0].displayIcon) 
                      || skin.displayIcon;

    weaponSkinDetailContainer.innerHTML = `
        <div class="p-4">
            <h4 class="text-white text-xl font-bold">${skin.displayName}</h4>
            <img src="${mainImage}" alt="${skin.displayName}" class="w-40 h-40 object-cover mx-auto rounded mt-4">
            ${streamedVideo ? `
                <video id="weapon-skin-video" class="w-full mt-4 rounded" controls autoplay>
                    <source src="${streamedVideo}" type="video/mp4">
                    Tu navegador no soporta videos.
                </video>
            ` : `<p class="text-gray-300 mt-4 text-center">No hay video disponible para esta skin.</p>`}
        </div>
    `;

    weaponSkinDetailSection.classList.remove("hidden", "translate-y-full", "opacity-0");
    weaponSkinDetailSection.classList.add("translate-y-0", "opacity-100");

    // Cerrar automáticamente al terminar el video, si existe
    const videoElement = document.getElementById("weapon-skin-video");
    if (videoElement) {
        videoElement.addEventListener("ended", () => {
            closeWeaponSkinDetail();
        });
    }
};

const closeWeaponSkinDetail = () => {
    weaponSkinDetailSection.classList.remove("translate-y-0", "opacity-100");
    weaponSkinDetailSection.classList.add("translate-y-full", "opacity-0");
    setTimeout(() => weaponSkinDetailSection.classList.add("hidden"), 300);
};

document.getElementById("close-weapon-skin-detail")?.addEventListener("click", closeWeaponSkinDetail);

});
