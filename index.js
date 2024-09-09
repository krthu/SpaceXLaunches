const launchesElement = document.getElementById('launches-container');
const loadButton = document.getElementById('load-button')
const overlayElement = document.getElementById('overlay');
let pageNumber = 1;

async function fetchData(page = 1) {
    const apiUrl = 'https://api.spacexdata.com/v4/launches/query'

    const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: {
                upcoming: false,
                "links.flickr.original" : { $exists: true, $ne: [] }
            },
            options: {
                limit: 20,
                page: page,
                sort: {
                    flight_number: 'desc'
                },
                populate: [
                    'rocket',
                    'launchpad'
                ]
            }
        })
    });

    const data = await res.json();
    console.log(data);
    data.docs.forEach(launch => {
        getLaunchElement(launch)
    });
}
const toggleOverlayShow = () => {
    overlayElement.innerHTML = '';
    overlayElement.classList.toggle('show')
}

overlayElement.addEventListener('click', toggleOverlayShow)


const getLaunchElement = (launch) => {

    const container = document.createElement('div');
    container.classList.add('launch-container')

    const img = document.createElement('img');
    img.src = launch.links.flickr.original;

    container.appendChild(img);

    const infoElement = getInfoElement(launch);
    container.addEventListener('click', () => {
        toggleOverlayShow();
        showLaunchDetails(launch);
    
    });

    container.appendChild(infoElement);
    launchesElement.appendChild(container);    
}


const getInfoElement = (launch) => {
    const infoSection = document.createElement('section');
    const dateElement = document.createElement('h2');
    dateElement.innerText = getDate(launch.date_utc)
    infoSection.classList.add('info-section');
    infoSection.appendChild(dateElement);

    infoSection.appendChild(getLabelInfoRow('Mission', launch.name));
    infoSection.appendChild(getLabelInfoRow('Rocket', launch.rocket.name));
    infoSection.appendChild(getLabelInfoRow('Result', launch.success ? 'Success' : 'Failure'));
    // infoSection.addEventListener('click', )
    return infoSection

}



const getLabelInfoRow = (label, info) => {
    const row = document.createElement('p');
    const span = document.createElement('span');
    span.classList.add('label');
    span.innerText = `${label}: `;
    row.appendChild(span);
  
    const infoText = document.createTextNode(info);
    row.appendChild(infoText);
    // row.innerText += `${info}`
    return row
}

const getDate = (dateString) => {
    const dateObj = new Date(dateString);
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`
}

loadButton.addEventListener('click', () => {
    pageNumber++;
    fetchData(pageNumber);
});

const showLaunchDetails = (launch) => {
    const container = document.createElement('section');
    container.classList.add('launch-deatils-container');
    

    const img = document.createElement('img');
    img.src = launch.links.flickr.original;

    if(img.width < img.height) {
        console.log('Portrait');
        container.classList.add('portrait-image');
    } else {
        console.log('Landscape');
    }

    // img.classList.add('detaild-image');
    container.appendChild(img);

    console.log(launch)
    const infoElement = getInfoElement(launch);
    addDetailedInfo(infoElement, launch);
    container.appendChild(infoElement, launch);

    overlayElement.appendChild(container);



}

const addDetailedInfo = (infoElement, launch) => {
    // console.log(launch.flight_number);
    infoElement.appendChild(getLabelInfoRow('Flight Number', launch.flight_number));
    infoElement.appendChild(getLabelInfoRow('Crew', launch.crew.length == 0 ? 'Unmanned' : launch.crew.length));
    infoElement.appendChild(getLabelInfoRow('Location', launch.launchpad.region));
    infoElement.appendChild(getLabelInfoRow('Locality', launch.launchpad.locality));

    infoElement.appendChild(getLabelLinkRow('Webcast', launch.links.webcast, 'Watch'));
}

const getLabelLinkRow = (label, link, text) => {
    const row = document.createElement('p');
    const span = document.createElement('span');
    span.classList.add('label');
    span.innerText = `${label}: `;
    row.appendChild(span);
  
    // const infoText = document.createTextNode(info);
    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.innerText = text
    row.appendChild(linkElement);
    // row.innerText += `${info}`
    return row

}












fetchData(1)