/* Фильтр каталога: по категории и по названию */
var buttons = document.querySelectorAll('.filter-btn');
var cards = document.querySelectorAll('.product');
var search = document.getElementById('search');
var empty = document.getElementById('empty');
var category = 'all';

function updateCatalog() {
	var text = search.value.toLowerCase().trim();
	var shown = 0;

	for (var i = 0; i < cards.length; i++) {
		var card = cards[i];
		var name = card.querySelector('h3').textContent.toLowerCase();
		var okCategory = category === 'all' || card.getAttribute('data-category') === category;
		var okText = name.indexOf(text) !== -1;

		if (okCategory && okText) {
			card.classList.remove('hide');
			shown++;
		} else {
			card.classList.add('hide');
		}
	}

	if (shown === 0) {
		empty.classList.remove('hide');
	} else {
		empty.classList.add('hide');
	}
}

function onButtonClick() {
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].classList.remove('active');
	}
	this.classList.add('active');
	category = this.getAttribute('data-filter');
	updateCatalog();
}

for (var i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener('click', onButtonClick);
}
search.addEventListener('input', updateCatalog);
