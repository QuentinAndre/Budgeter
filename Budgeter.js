
$(function () { 

    var $j = jQuery.noConflict();
    /* Constants:
     FUND_TYPE = ("Money", "Food", or "Mobility")
     FUND_AMOUNT = Amount of money on the fund
     MIN_SPEND = Minimum quantity that must be spent on Food and Transportation */
    var FUND_TYPE = "Food";
    var FUND_AMOUNT = 150;
    var MIN_SPEND = 120;

    /* How much of that minimum amount should be deducted from restricted-use fund */
    var fromfund_baseline = Math.min(MIN_SPEND / 2, FUND_AMOUNT / 2);

    /* Initialization of displayed variables */
    var foodfromacc = 0; // Amount from account spent on food...
    var foodfromfund = fromfund_baseline; // Amount from fund spent on food...
    var transfromacc = 0; // Amount from account spent on transportation...
    var transfromfund = fromfund_baseline; // ...
    var leisfromacc = 0; // ...
    var leisfromfund = 0; // Amount from fund spent on leisure.
    var accbalance = 0; // Amount left on account.
    var fundbalance = 0; // Amount left on fund.

    /* Initialization of data variables, ultimately recorded in Qualtrics */
    var foodvalue = MIN_SPEND, transvalue = MIN_SPEND, leisvalue = 0;
    var taskduration = 0;
    var foodclicks = 0;
    var transportclicks = 0;
    var leisureclicks = 0;
    var food_hist = [];
    var transport_hist = [];
    var leisure_hist = [];

    /* Starting up the page */
    setUpPage();
    refreshBudget();
    var startdate = new Date(); // Start the timer.

    function setUpPage() { // Create the objects on the page, and display the constants.
        /* Display the budget name and amount */
        $j("#paymentamount").text("$" + FUND_AMOUNT);
        if (FUND_TYPE == "Money") {
            $j("#accountname").text("Stipend fund");
            $j("#paymentname").text("Stipend");
        } else if (FUND_TYPE == "Food") {
            $j("#accountname").text("Food fund");
            $j("#paymentname").text("Food Plan");
        } else if (FUND_TYPE == "Mobility") {
            $j("#accountname").text("Mobility fund");
            $j("#paymentname").text("Mobility Plan");
        }


        /* Initialize three sliders from JQuery UI */
        $j("#food, #transport, #leisure").slider({
            orientation: "horizontal",
            range: "min",
            min: MIN_SPEND,
            max: 200,
            value: 0,
            step: 10
        });

        /* Setting up the sliders properties and binding the functions to each Slider */

        $j("#food").slider("option", "max", 400);
        $j("#food").on("slidestop", function () {
            foodclicks = foodclicks + 1;
            storeHistory();
        });
        $j("#food").on("slide", function (event, ui) {
            foodvalue = ui.value;
            refreshBudget()
        });


        $j("#transport").slider("option", "max", 300);
        $j("#transport").on("slidestop", function () {
            transportclicks = transportclicks + 1;
            storeHistory();
        });
        $j("#transport").on("slide", function (event, ui) {
            transvalue = ui.value;
            refreshBudget()
        });

        $j("#leisure").slider("option", "max", 600);
        $j("#leisure").slider("option", "min", 0);
        $j("#leisure").on("slidestop", function () {
            leisureclicks = leisureclicks + 1;
            storeHistory();
        });
        $j("#leisure").on("slide", function (event, ui) {
            leisvalue = ui.value;
            refreshBudget()
        });

        /* Binding the submit function to the budget button */
        $j("#valbudget").button().click(submitBudget);

        /* Initialize the sliders value */
        $j("#food").slider("value", foodvalue);
        $j("#transport").slider("value", transvalue);
        $j("#leisure").slider("value", leisvalue);
    }

    function refreshBudget() { // Refreshes the budget, and updates the page. Bound to the SliderChange event
        if (FUND_TYPE == "Food") {
            foodfromacc = Math.max(foodvalue - FUND_AMOUNT, 0);
            foodfromfund = Math.min(FUND_AMOUNT, foodvalue);
            fundbalance = (FUND_AMOUNT - foodfromfund);
            accbalance = 1000 - 700 - (foodfromacc + transvalue + leisvalue);
            $j("#foodfromacc").text("- $" + foodfromacc);
            $j("#foodfromfund").text("- $" + foodfromfund);
            $j("#transfromacc").text("- $" + transvalue);
            $j("#transfromfund").text("");
            $j("#leisfromacc").text("- $" + leisvalue);
            $j("#leisfromfund").text("");

        } else if (FUND_TYPE == "Mobility") {
            transfromacc = Math.max(transvalue - FUND_AMOUNT, 0);
            transfromfund = Math.min(FUND_AMOUNT, transvalue);
            fundbalance = (FUND_AMOUNT - transfromfund);
            accbalance = 1000 - 700 - (foodvalue + transfromacc + leisvalue);
            $j("#foodfromacc").text("- $" + foodvalue);
            $j("#foodfromfund").text("");
            $j("#transfromacc").text("- $" + transfromacc);
            $j("#transfromfund").text("- $" + transfromfund);
            $j("#leisfromacc").text("- $" + leisvalue);
            $j("#leisfromfund").text("");

        } else if (FUND_TYPE == "Money") {
            /* Some ugly computations to divide up the Stipend between the different categories... */
            foodfromfund = Math.min(FUND_AMOUNT - transfromfund - leisfromfund, foodvalue - fromfund_baseline);
            foodfromacc = Math.max(0, foodvalue - foodfromfund);
            transfromfund = Math.min(FUND_AMOUNT - foodfromfund - leisfromfund, transvalue - fromfund_baseline);
            transfromacc = Math.max(0, transvalue - transfromfund);
            leisfromfund = Math.min(FUND_AMOUNT - transfromfund - foodfromfund, leisvalue);
            leisfromacc = Math.max(0, leisvalue - leisfromfund);
            fundbalance = (FUND_AMOUNT - foodfromfund - transfromfund - leisfromfund);
            accbalance = 1000 - 700 - (foodfromacc + transfromacc + leisfromacc);
            $j("#foodfromacc").text("- $" + foodfromacc);
            $j("#foodfromfund").text("- $" + foodfromfund);
            $j("#transfromacc").text("- $" + transfromacc);
            $j("#transfromfund").text("- $" + transfromfund);
            $j("#leisfromacc").text("- $" + leisfromacc);
            $j("#leisfromfund").text("- $" + leisfromfund);
        }

        /* Checking that the budget is balanced */
        if ((fundbalance == 0) && (accbalance == 0)) {
            $j("#budgstatus").text("Balanced");
            $j("#budgtext").text("Your budget is balanced. If you are satisfied with this budget, you can validate it.");
            $j("#budgetcheck").removeClass().addClass("panel panel-info");
            $j("#valbudget").button("enable");
        } else if (accbalance < 0) {
            $j("#budgstatus").text("In Deficit");
            $j("#budgtext").text("You have allocated more money than what you have to spend. Please balance your budget.");
            $j("#budgetcheck").removeClass().addClass("panel panel-danger");
            $j("#valbudget").button("disable");
        } else if ((fundbalance > 0) && (accbalance == 0)) {
            $j("#budgstatus").text("In Surplus");
            $j("#budgtext").text("You still have some money on your other account to spend. Please allocate all the money.");
            $j("#budgetcheck").removeClass().addClass("panel panel-success");
            $j("#valbudget").button("disable");
        } else if (accbalance > 0) {
            $j("#budgstatus").text("In Surplus");
            $j("#budgtext").text("You still have some money to spend. Please allocate all the money.");
            $j("#budgetcheck").removeClass().addClass("panel panel-success");
            $j("#valbudget").button("disable");
        }
        if (accbalance >= 0) {
            $j("#accbalance").text("+ $" + accbalance);
        } else {
            accbalance = accbalance * -1;
            $j("#accbalance").text("- $" + accbalance);
        }
        $j("#fundbalance").text("+ $" + fundbalance);

    }


    function storeHistory() { // Track changes in budget over time and store it. Bound to the SliderStop event
        food_hist.push(foodvalue);
        transport_hist.push(transvalue);
        leisure_hist.push(leisvalue);
    }

    function submitBudget() { // Display the data that would be stored in Qualtrics
        var enddate = new Date();
        taskduration = (enddate.getTime() - startdate.getTime());
        alert("FoodValue" + foodvalue);
        alert("TransportValue" + transvalue);
        alert("LeisureValue" + leisvalue);
        alert("FoodHistory" + food_hist.join("*"));
        alert("TransportHistory" + transport_hist.join("*"));
        alert("LeisureHistory" + leisure_hist.join("*"));
        alert("FoodClicks" + foodclicks);
        alert("TransportClicks" + transportclicks);
        alert("LeisureClicks" + leisureclicks);
    }

});