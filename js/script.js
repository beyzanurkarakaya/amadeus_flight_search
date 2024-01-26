function toggleReturnDate() {
    const returnDateInput = document.getElementById('returnDate');
    returnDateInput.disabled = !returnDateInput.disabled;
}

// Sıralama seçeneğindeki değişiklikleri dinlemek için event listener ekleyin
const selection = document.getElementById('sort-flight');
selection.removeEventListener('change', sortFlightsBy); // Önceki event listener'ı kaldır
selection.addEventListener('change', sortFlightsBy); // Yeni event listener'ı ekle

// Arama butonuna tıklama olayını dinle
const searchButton = document.getElementById('searchButton');
searchButton.removeEventListener('click', searchFlights); // Önceki event listener'ı kaldır
searchButton.addEventListener('click', searchFlights); // Yeni event listener'ı ekle

function searchFlights() {
    const departureCity = document.getElementById('inlineFormInputFrom').value;
    const arrivalCity = document.getElementById('inlineFormInputWhere').value;
    const departureDate = document.getElementById('departureDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const oneWay = document.getElementById('oneWay').checked;

    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = 'block';

    // Simüle edilmiş bir API isteği yapılıyor.
    setTimeout(() => {
        // Simüle edilmiş verileri kullanarak uçuşları listele.
        const mockData = [
            // izmir - istanbul
            { from: 'izmir', fromCod: 'ADB', where: 'istanbul', whereCod: 'IST', departureDate: '2024-01-28', returnDate: '2024-01-29', airline: 'SunExpress', departureTime: '12:00', arrivalTime: '14:00', duration: '2:00', price: '210' },

            { from: 'izmir', fromCod: 'ADB', where: 'istanbul', whereCod: 'IST', departureDate: '2024-01-28', returnDate: '2024-01-31', airline: 'Türk Hava Yolları', departureTime: '13:10', arrivalTime: '15:15', duration: '2:05', price: '250' },

            { from: 'izmir', fromCod: 'ADB', where: 'istanbul', whereCod: 'IST', departureDate: '2024-01-28', returnDate: '2024-01-29', airline: 'Pegasus', departureTime: '11:35', arrivalTime: '13:45', duration: '2:10', price: '230' },

            // istanbul - izmir
            { from: 'istanbul', fromCod: 'IST', where: 'izmir', whereCod: 'ADB', departureDate: '2024-01-29', returnDate: '2024-01-30', airline: 'SunExpress', departureTime: '14:00', arrivalTime: '16:25', duration: '2:25', price: '190' },

            { from: 'istanbul', fromCod: 'IST', where: 'izmir', whereCod: 'ADB', departureDate: '2024-01-29', returnDate: '2024-01-30', airline: 'Pegasus', departureTime: '12:15', arrivalTime: '14:50', duration: '2:35', price: '205' },

            // izmir - ankara
            { from: 'izmir', fromCod: 'ADB', where: 'ankara', whereCod: 'ESB', departureDate: '2024-01-28', returnDate: '2024-01-29', airline: 'SunExpress', departureTime: '12:00', arrivalTime: '13:15', duration: '1:15', price: '190' },

            { from: 'izmir', fromCod: 'ADB', where: 'ankara', whereCod: 'ESB', departureDate: '2024-01-28', returnDate: '2024-01-29', airline: 'Pegasus', departureTime: '12:15', arrivalTime: '13:40', duration: '1:25', price: '195' },

            // istanbul - ankara
            { from: 'istanbul', fromCod: 'IST', where: 'ankara', whereCod: 'ESB', departureDate: '2024-01-29', returnDate: '2024-01-30', airline: 'SunExpress', departureTime: '13:30', arrivalTime: '14:55', duration: '1:25', price: '180' },

            { from: 'istanbul', fromCod: 'IST', where: 'ankara', whereCod: 'ESB', departureDate: '2024-01-29', returnDate: '2024-01-30', airline: 'Pegasus', departureTime: '16:00', arrivalTime: '17:20', duration: '1:20', price: '185' },
            // Diğer uçuşlar buraya eklenebilir.
        ];

        // Uygun uçuşları filtrele
        const filteredFlights = mockData.filter(flight => {
            //kalkış
            const isMatchingDepartureCity = flight.from.toLowerCase() === departureCity.toLowerCase();
            //varış
            const isMatchingArrivalCity = flight.where.toLowerCase() === arrivalCity.toLowerCase();
            const isMatchingDepartureDate = new Date(flight.departureDate).toDateString() === new Date(departureDate).toDateString();
            const isMatchingReturnDate = new Date(flight.returnDate).toDateString() === new Date(returnDate).toDateString();

            if (oneWay) {
                return isMatchingDepartureCity && isMatchingArrivalCity && isMatchingDepartureDate;
            } else {
                return isMatchingDepartureCity && isMatchingArrivalCity && isMatchingDepartureDate && isMatchingReturnDate;
            }
        });

        // Uygun dönüş uçuşlarını filtrele
        const returnFlights = mockData.filter(flight => {
            //kalkış
            const isMatchingDepartureCity = flight.from.toLowerCase() === arrivalCity.toLowerCase();
            //varış
            const isMatchingArrivalCity = flight.where.toLowerCase() === departureCity.toLowerCase();
            const isMatchingDepartureDate = new Date(flight.departureDate).toDateString() === new Date(returnDate).toDateString();

            return !oneWay && isMatchingDepartureCity && isMatchingArrivalCity && isMatchingDepartureDate;
        });

        const sortOption = document.getElementById('sort-flight').value;

        // Uçuşları sırala
        const sortedFlights = sortFlightsBy(sortOption, filteredFlights);
        const sortedReturnFlights = sortFlightsBy(sortOption, returnFlights);

        if (oneWay) {
            displayFlights(sortedFlights)
        } else {
            displayDoubleFlights(sortedFlights, sortedReturnFlights)
        }

    }, 2000); // Simülasyon amaçlı 2 saniye bekletiliyor.
}

function displayFlights(flights) {
    const loadingDiv = document.getElementById('loading');
    const flightListDiv = document.getElementById('flight-list');

    loadingDiv.style.display = 'none';
    flightListDiv.style.display = 'block';

    // Uçuşları listeleme fonksiyonu burada çağrılır.
    if (flights.length > 0) {
        flightListDiv.innerHTML = '';
        flights.forEach(flight => {
            const [hours, minutes] = flight.duration.split(':').map(Number);
            const flightInfo = `
                <div class="row no-gutters flights mb-4">
                    <div class="col-md-6">
                        <p class="h5">${flight.departureTime} • ${flight.arrivalTime}</p>
                        <p class="card-text"><small class="text-muted">${flight.fromCod} • ${flight.whereCod} • ${flight.airline}</small></p>
                    </div>
                    <div class="col-md-4">
                        <p>${hours} saat ${minutes} dakika</p>
                    </div>
                    <div class="col-md-2">
                        <p><strong>₺${flight.price}</strong></p>
                        <button class="btn btn-outline-danger">Satın Al</button>
                    </div>
                </div>
            `;
            flightListDiv.innerHTML += flightInfo;
        });
    } else {
        flightListDiv.innerHTML = 'Uygun uçuş bulunamadı.';
    }
}

function displayDoubleFlights(flights, returnFlights) {
    const loadingDiv = document.getElementById('loading');
    const flightListDiv = document.getElementById('flight-list');

    loadingDiv.style.display = 'none';
    flightListDiv.style.display = 'block';

    // Uçuşları listeleme fonksiyonu burada çağrılır.
    if (flights.length > 0) {
        flightListDiv.innerHTML = '';
        flights.forEach(flight => {
            returnFlights.forEach(returnFlight => {
                const [hours, minutes] = flight.duration.split(':').map(Number);
                const [rhours, rminutes] = returnFlight.duration.split(':').map(Number);
                const flightInfo = `
                    <div class="row no-gutters flights mb-4">
                        <div class="col-md-6">
                            <p class="h5">${flight.departureTime} • ${flight.arrivalTime}</p>
                            <p class="card-text"><small class="text-muted">${flight.fromCod} • ${flight.whereCod} • ${flight.airline}</small></p>
                            
                            <p class="h5">${returnFlight.departureTime} • ${returnFlight.arrivalTime}</p>
                            <p class="card-text"><small class="text-muted">${returnFlight.fromCod} • ${returnFlight.whereCod} • ${returnFlight.airline}</small></p>
                        </div>
                        <div class="col-md-4">
                            <p>${hours} saat ${minutes} dakika</p>
                            <br>
                            <p>${rhours} saat ${rminutes} dakika</p>
                            <br>
                        </div>
                        <div class="col-md-2 pl-4">
                            <br>
                            <p><strong>₺${parseInt(flight.price) + parseInt(returnFlight.price)}</strong></p>
                            <button class="btn btn-outline-danger">Satın Al</button>
                        </div>
                    </div>
            `;
            flightListDiv.innerHTML += flightInfo;
            })
            
        });
    } else {
        flightListDiv.innerHTML = 'Uygun uçuş bulunamadı.';
    }
}

function sortFlightsBy(option, flights) {
    return flights.sort((a, b) => {
        switch (option) {
            case "priceAsc":
                return parseInt(a.price) - parseInt(b.price);
            case "priceDesc":
                return parseInt(b.price) - parseInt(a.price);
            case "depAsc":
                return getTimeAsMinutes(a.departureTime) - getTimeAsMinutes(b.departureTime);
            case "depDesc":
                return getTimeAsMinutes(b.departureTime) - getTimeAsMinutes(a.departureTime);
            case "arrAsc":
                return getTimeAsMinutes(a.returnTime) - getTimeAsMinutes(b.returnTime);
            case 'arrDesc':
                return getTimeAsMinutes(b.returnTime) - getTimeAsMinutes(a.returnTime);
            case 'durAsc':
                return getTimeAsMinutes(a.duration) - getTimeAsMinutes(b.duration);
            case 'durDesc':
                return getTimeAsMinutes(b.duration) - getTimeAsMinutes(a.duration);
            default:
                return 0;
        }
    });
}

function getTimeAsMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

// // Sıralama seçeneğinde değişiklik olduğunda çağrılacak fonksiyon
function onSortOptionChange() {
    searchFlights(); // Yeniden arama yaparak ve sıralama seçeneğini göz önünde bulundurarak listeyi güncelle
}
