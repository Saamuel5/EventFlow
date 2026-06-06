/*LOGIN AND SIGN UP*/
/*GSAP ANIMATION*/

const tl = gsap.timeline({})

/*ANIMATION FROM CENTER*/
tl.fromTo(
    '.login__content',
    {
        y: -800,
        scaleX: .2,
        scaleY: .5,
        opacity: 0
    },
    {
        y:0,
        scaleX: .2,
        scaleY: .5,
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out'
    }
)

/*EXPAND VERTICALLY*/
tl.to(
    '.login__content',
    {
        scaleY: 1,
        duration: .6,
        ease: 'power3.out'
    }, '-=0.3'
)

/*EXPAND HORIZONTALLY*/
tl.to(
    '.login__content',
    {
        scaleX: 1,
        duration: .7,
        ease: 'power3.out'
    }, '-=0.2'
)

/*ANIMATED BACKGROUND IMG*/
tl.to(
    '.login__img',
    {
        scale: 1.08,
        duration: 5,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
        transformOrigin: 'center center'
    }
)

/*ANIMATED FORM*/
gsap.defaults({opacity: 0, y: -60, ease: 'power2.out', duration: 1.2})
gsap.from('.login__title', {delay: 2.5})
gsap.from('.login__form > *', {delay: 2.7, stagger: .2})
gsap.from('.login__img',{y:0, x:100, delay: 3.2, ease: 'elastic.out(1,0.6)'})

const signupBtn = document.getElementById("signup-btn")
const backLoginBtn = document.getElementById("back-login-btn")

const loginContainer = document.getElementById("login__container")
const signupContainer = document.getElementById("signup__container")

// SHOW SIGNUP
signupBtn.addEventListener("click", (e) => {
    e.preventDefault()

    gsap.to(loginContainer, {
        opacity: 0,
        y: -30,
        duration: .5,
        onComplete: () => {
            loginContainer.style.display = "none"

            signupContainer.style.display = "block"

            gsap.fromTo(
                signupContainer,
                {
                    opacity: 0,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: .5
                }
            )
        }
    })
})

// SHOW LOGIN
backLoginBtn.addEventListener("click", (e) => {
    e.preventDefault()

    gsap.to(signupContainer, {
        opacity: 0,
        y: -30,
        duration: .5,
        onComplete: () => {
            signupContainer.style.display = "none"

            loginContainer.style.display = "block"

            gsap.fromTo(
                loginContainer,
                {
                    opacity: 0,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: .5
                }
            )
        }
    })
})

const loginImageWrapper = document.querySelector(".login__image")

// SHOW SIGNUP
signupBtn.addEventListener("click", (e) => {
    e.preventDefault()

    loginImageWrapper.classList.add("login--signup")
    loginImageWrapper.classList.remove("login--login")
})

// SHOW LOGIN
backLoginBtn.addEventListener("click", (e) => {
    e.preventDefault()

    loginImageWrapper.classList.add("login--login")
    loginImageWrapper.classList.remove("login--signup")
})

const loginWrapper = document.body

signupBtn.addEventListener("click", (e) => {
    e.preventDefault()

    loginWrapper.classList.add("login--signup")
    loginWrapper.classList.remove("login--login")
})

backLoginBtn.addEventListener("click", (e) => {
    e.preventDefault()

    loginWrapper.classList.add("login--login")
    loginWrapper.classList.remove("login--signup")
})

/*BUTTON FUNCTIONS*/
/*LOGIN BUTTON*/
const loginForm = document.querySelector("#login__container form")

loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = document.getElementById("email")
    const password = document.getElementById("login_password")

    if (email.value && password.value) {
        window.location.href = "taskboard.html"
    }
})

/*SIGN UP BUTTON*/
const signupForm = document.querySelector("#signup__container form")

signupForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const firstName = document.getElementById("first_name")
    const password = document.getElementById("signup_password")

    if (firstName.value && password.value) {
        window.location.href = "taskboard.html"
    }
})

