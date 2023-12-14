$(document).ready(function () {
    $(window).scroll(function () {
        // sticky navbar on scroll script
        if (this.scrollY > 20) {
            $('.navbar').addClass("sticky");
        } else {
            $('.navbar').removeClass("sticky");
        }

        // scroll-up button show/hide script
        if (this.scrollY > 500) {
            $('.scroll-up-btn').addClass("show");
        } else {
            $('.scroll-up-btn').removeClass("show");
        }
    });

    // slide-up script
    $('.scroll-up-btn').click(function () {
        $('html').animate({scrollTop: 0});
        // removing smooth scroll on slide-up button click
        $('html').css("scrollBehavior", "auto");
    });

    $('.navbar .menu li a').click(function () {
        // applying again smooth scroll on menu items click
        $('html').css("scrollBehavior", "smooth");
    });

    // toggle menu/navbar script
    $('.menu-btn').click(function () {
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });

    // typing text animation script
    var typed = new Typed(".typing", {
        strings: [
            " GIS Developer", "Geospatial Analyst", "Land Surveyor"
        ],
        typeSpeed: 180,
        backSpeed: 100,
        loop: true
    });

    /*var typed = new Typed(".typing-2", {
        strings: [" GIS Developer", "Geospatial Analyst", "Land Surveyor"],
        typeSpeed: 80,
        backSpeed: 30,
        loop: true,
        showCursor: false // Hide the typing cursor
    });*/

    // owl carousel script
    $('.carousel').owlCarousel({
        margin: 20,
        loop: true,
        autoplay: true,
        autoplayTimeOut: 1000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            300: {
                items: 1,
                nav: false
            },
            500: {
                items: 1,
                nav: false
            }
        }
    });
});

function handleSubmit(event) {}



/// JavaScript
function updateDateTime() {
    const currentDate = new Date();
    const day = currentDate.toLocaleString('en-US', {day: 'numeric'});
    const month = currentDate.toLocaleString('en-US', {month: 'short'});
    const time = currentDate.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    });

    const formattedDate = `${currentDate.toLocaleString('en-US', {
        weekday: 'short'})} ${day} ${month}  | 
                             ${time}`;
        document
            .getElementById('currentDateTime')
            .textContent = formattedDate;
    }

    // Call the function to update the date and time every second
    setInterval(updateDateTime, 1000);

// Initial call to set the date and time when the page loads
updateDateTime();


const gifArray = [
    "assets/gif/gif2.gif",
    "assets/gif/gif3.gif",
    "assets/gif/gif4.gif",
    "assets/gif/gif5.gif",
    "assets/gif/gif6.gif",
    "assets/gif/gif7.gif",
    "assets/gif/gff.gif"
]; // Add the paths to your GIFs here
        let currentGifIndex = 0;

function changeGif() {
    // Get the img element by its ID
    const animatedGif = document.getElementById('animatedGif');

    // Change the source attribute to the next GIF in the array
    animatedGif.src = gifArray[currentGifIndex];

    // Increment the index or reset to 0 if it exceeds the array length
    currentGifIndex = (currentGifIndex + 1) % gifArray.length;
}

// Call the changeGif function initially
changeGif();

// Set an interval to change the GIF every 3 seconds (adjust as needed)
setInterval(changeGif, 7000);
