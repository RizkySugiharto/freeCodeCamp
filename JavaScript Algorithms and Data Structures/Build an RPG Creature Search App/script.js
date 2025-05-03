const apiUrl = 'https://rpg-creature-api.freecodecamp.rocks/api/creature';

function search() {
    const searchInput = document.getElementById('search-input');
    const loadingText = document.getElementById('loading-text');

    loadingText.innerText = 'Please wait....';
    fetch(`${apiUrl}/${searchInput.value}`)
        .then((response) => {
            if (response.status == 404) {
                alert('Creature not found');
            } else {

                response.json().then((result) => {
                    document.getElementById('creature-name').innerText = result.name.toUpperCase();
                    document.getElementById('creature-id').innerText = `#${result.id}`;
                    document.getElementById('weight').innerText = result.weight;
                    document.getElementById('height').innerText = result.height;

                    for (const stat of result.stats) {
                        document.getElementById(stat.name).innerText = stat.base_stat;
                    }

                    const types = document.getElementById('types');
                    types.replaceChildren();

                    for (const creatureType of result.types) {
                        const typeSpan = document.createElement('span');
                        typeSpan.classList.add(creatureType.name.toLowerCase());
                        typeSpan.innerText = creatureType.name.toUpperCase();

                        types.appendChild(typeSpan);
                    }

                    document.getElementById('special-skill-name').innerText = result.special.name;
                    document.getElementById('special-skill-description').innerText = result.special.description;

                    const infoBoxes = document.getElementsByClassName('info-box');
                    for (const box of infoBoxes) {
                        box.classList.remove('hidden');
                    }

                    loadingText.innerText = '';
                });
            }
        })

    return false;
}