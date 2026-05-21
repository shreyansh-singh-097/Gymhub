
async function loadData() {

    const users =
        await fetch("../data/users.json")
            .then(res => res.json());

    const cards =
        await fetch("../data/cards.json")
            .then(res => res.json());

    const goals =
        await fetch("../data/goal.json")
            .then(res => res.json());

    const plans =
        await fetch("../data/plans.json")
            .then(res => res.json());

    const activities =
        await fetch("../data/recentActivity.json")
            .then(res => res.json());

    const reports =
        await fetch("../data/detailedReport.json")
            .then(res => res.json());

    const upcomingClass =
        await fetch("../data/upcomingClass.json")
            .then(res => res.json());

    return {
        users,
        cards,
        goals,
        plans,
        activities,
        reports,
        upcomingClass
    };

}



// ==================== THEME TOGGLE =================

document.addEventListener("DOMContentLoaded", () => {


    // ================== LOGIN PAGE ==================

    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {

        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();

            const useremail = document.getElementById("login-email").value;

            const password = document.getElementById("login-pass").value;


            loadData().then(data => {

                const currentUser =
                    data.users.find(
                        u =>
                            u.useremail === useremail &&
                            u.password === password
                    );


                if (currentUser) {
                    localStorage.setItem("currentUserId", currentUser.id);

                    window.location.href = "overview.html";
                }
                else {
                    alert(
                        "Wrong email or password"
                    );
                }

            });

        });

    }

    // ======================= OVERVIEW PAGE =======================

    const renewBtn = document.getElementById("renew-btn");

    if (renewBtn) {

        loadData().then(data => {

            const id =
                localStorage.getItem(
                    "currentUserId"
                );


            const currentUser =
                data.users.find(
                    u =>
                        u.id == id
                );


            const currentUserCards =
                data.cards.find(
                    u =>
                        u.id == id
                );


            if (currentUser) {

                document.getElementById("header-name").textContent = `Hello, ${currentUser.profile.name}`;
                document.getElementById("active-plan").textContent = currentUser.profile.membership;
                document.getElementById("popular-plan").textContent = currentUser.profile.popular;
                document.getElementById("reward-points").textContent = currentUser.profile.rewardPoints;

            }



            if (currentUserCards) {

                document.getElementById("total-session-value").textContent = currentUserCards.totalSessions.value;
                document.getElementById("total-session-percent").textContent = currentUserCards.totalSessions.change;

                document.getElementById("calories-value").textContent = currentUserCards.caloriesBurned.value;

                const savedCalories = localStorage.getItem("userCalories");
                document.getElementById("calories-value").textContent = savedCalories || currentUserCards.caloriesBurned.value;


                document.getElementById("streak-value").textContent = currentUserCards.streak.value;

                document.getElementById("weekly-rank-value").textContent = currentUserCards.weeklyRank.value;
            }

        });

        loadData().then(data => {

            const id =
                localStorage.getItem(
                    "currentUserId"
                );


            const currentUser =
                data.users.find(
                    u =>
                        u.id == id
                );


            const currentUpcomingClass =
                data.upcomingClass.find(
                    u => u.id == id
                );

            if (currentUpcomingClass) {
                document.getElementById("upcoming-class-topic").textContent = currentUpcomingClass.name;
                document.getElementById("upcoming-class-time").textContent = currentUpcomingClass.time;
                document.getElementById("upcoming-class-studio").textContent = currentUpcomingClass.studio;
            }

        });


        loadData().then(data => {

            const id =
                localStorage.getItem(
                    "currentUserId"
                );


            const currentUser =
                data.users.find(
                    u =>
                        u.id == id
                );


            const currentActivity =
                data.activities.find(
                    u => u.id == id
                );

            const activityList = document.getElementById("activityList");

            if (currentActivity && activityList) {

                activityList.innerHTML = "";

                const localActivities = JSON.parse(localStorage.getItem("userActivities")) || {};



                const userLocal = localActivities[id] || [];


                const allData = [

                    ...userLocal,

                    ...currentActivity.activities

                ];

                allData.forEach(
                    activity => {

                        activityList.innerHTML += `
    
                         <div class="activity-item">
    
                                    <div class="activity-info">
                                        <h3 >${activity.workout} </h3>
                                        <p>${activity.date} </p>
                                    </div>
    
                                    <div class="activity-calories">
                                        <h4>${activity.calories} </h4>
                                    </div>
    
                        </div>
    
                         `;

                    });

            }


        });

    }




    const saveBtn = document.getElementById("saveActivity");


    if (saveBtn) {

        saveBtn.addEventListener("click", (e) => {

            e.preventDefault();

            const userId = localStorage.getItem("currentUserId");

            const workoutFilled = document.getElementById("workoutType").value;

            const caloriesFilled = document.getElementById("calories").value || 0;
            const workoutduration = document.getElementById("duration").value || 0;
            const waterIntakeFilled = document.getElementById("water").value || 0;
            const weightFilled = document.getElementById("weight").value || 0;

            const newActivity = {
                workout: workoutFilled,
                date: "Today",
                duration: workoutduration + " mins",
                calories: "+" + caloriesFilled + " kcal"
            };

            //======== CARD UPDATE ========

            document.getElementById("water-value").textContent = waterIntakeFilled + " L";


            let durationCard = document.getElementById("duration-value");


            if (durationCard) {

                let oldDuration = parseInt(durationCard.textContent) || 0;
                durationCard.textContent = oldDuration + parseInt(workoutduration) + " mins";;

            }



            document.getElementById("weight-value").textContent = weightFilled + " kg";;
            

            if (caloriesCard) {

                let oldCalories = parseInt(caloriesCard.textContent) || 0;

                // caloriesCard.textContent = oldCalories + parseInt(caloriesFilled);

                let updatedCalories = oldCalories + parseInt(caloriesFilled);

                localStorage.setItem("userCalories", updatedCalories);


            }



            let allActivities =
                JSON.parse(
                    localStorage.getItem(
                        "userActivities"
                    )) || {};


            if (
                !allActivities[userId]
            ) {

                allActivities[userId] = [];

            }


            allActivities[userId]
                .unshift(
                    newActivity
                );


            localStorage.setItem(
                "userActivities",
                JSON.stringify(
                    allActivities
                ));


            alert("Activity Saved");

        });
    }




    // ================= menubar ====================


    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("main-sidebar");

    if (menuToggle && sidebar) {

        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.toggle("show-sidebar");
        });

        document.addEventListener("click", () => {
            sidebar.classList.remove("show-sidebar");
        });

        sidebar.addEventListener("click", (e) => {
            e.stopPropagation();
        });

    }


    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
    }

    const toggle = document.getElementById("themeToggle");

    if (toggle) {

        toggle.checked = !document.body.classList.contains("light-mode");

        toggle.addEventListener("change", () => {

            document.body.classList.toggle("light-mode");

            if (document.body.classList.contains("light-mode")) {
                localStorage.setItem("theme", "light");
            }
            else {
                localStorage.setItem("theme", "dark");
            }

        });

    }

    //================== BMI CALCULATOR =======================

    window.setGender = function (el, g) {
        document.querySelectorAll('.radio-btn').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
        window.calcBMI();
    }

    window.calcBMI = function () {
        const h = parseFloat(document.getElementById('bmi-height').value);
        const w = parseFloat(document.getElementById('bmi-weight').value);
        const age = parseFloat(document.getElementById('bmi-age').value) || 25;

        const valEl = document.getElementById('bmi-val');
        const catEl = document.getElementById('bmi-cat');
        const thumb = document.getElementById('bmi-thumb');

        if (!h || !w || h < 50 || w < 10) {
            valEl.textContent = '-';
            catEl.textContent = 'Enter your details to calculate';
            thumb.style.left = '0%';
            return;
        }

        const bmi = w / ((h / 100) ** 2);
        const rounded = Math.round(bmi * 10) / 10;

        valEl.textContent = rounded.toFixed(1);

        let adjustedBMI = bmi;

        if (age > 50) {
            adjustedBMI += 1;
        }
        else if (age < 18) {
            adjustedBMI -= 1;
        }

        let cat, col, pct;

        if (adjustedBMI < 18.5) {
            cat = 'Underweight';
            col = '#3b82f6';
            pct = Math.max(2, ((adjustedBMI - 16) / (18.5 - 16)) * 30);
        }
        else if (adjustedBMI < 25) {
            cat = 'Normal weight';
            col = '#22c55e';
            pct = 30 + ((adjustedBMI - 18.5) / (25 - 18.5)) * 25;
        }
        else if (adjustedBMI < 30) {
            cat = 'Overweight';
            col = '#BEFF00';
            pct = 55 + ((adjustedBMI - 25) / (30 - 25)) * 20;
        }
        else {
            cat = 'Obese';
            col = '#ef4444';
            pct = Math.min(98, 75 + ((adjustedBMI - 30) / (40 - 30)) * 23);
        }

        catEl.textContent = cat;
        catEl.style.color = col;

        thumb.style.left = pct + "%";
        thumb.style.background = col;

    }

    const uptimeEl = document.getElementById('uptime-blocks');

    if (uptimeEl) {
        let html = '<div style="display:flex;gap:3px;flex-wrap:wrap">';
        for (let i = 0; i < 52; i++) {
            const ok = Math.random() > 0.01;
            html += `<div style="width:10px;height:10px;border-radius:2px;background:${ok ? 'var(--lime)' : '#ef4444'};opacity:${ok ? 0.7 : 1}"></div>`;
        }
        html += '</div>';
        uptimeEl.innerHTML = html;
    }

});




