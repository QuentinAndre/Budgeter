.. highlight:: sh
==============
 Introduction
==============

:Date: August 17, 2016
:Version: 1.0.0
:Authors: Quentin ANDRE, quentin.andre@insead.edu
:Web site: https://github.com/QuentinAndre/Budgeter
:Copyright: This document has been placed in the public domain.
:License: Budgeter is released under the MIT license.

Purpose
=======

Budgeter is a minimal-functionality budgeting tool that can be used to investigate people's financial decision making.
The key functionality of the tool is to provide people with different types of income, and to restrict the type of purchases they can make with each income type.

The present version features two types of income (A general account, and a supplementary fund), and three different types of purchases (Groceries, Transportation and Leisure).
* The general account can be used to make any type of purchase.
* The supplementary fund can, depending on the configuration of the game, be used only for Groceries, only for Transportation, or for any kind of purchase.

The tool records the final allocation of budget, the number of clicks in each budget category, and all the intermediary budget allocations.

Content
=======

1. **Budgeter.html**: The HTML file of the tool.

2. **Budgeter.css**: The styling of the tool.

3. **Budgeter.js**: The javascript file of the tool for the Desktop version.

4. **BudgeterQualtrics.js**: The Qualtrics version of the Javascript code, to be copied in Qualtrics (see instructions below).

Installation
============
* Download the master branch as a zip:
 * https://github.com/QuentinAndre/Budgeter/archive/master.zip

Dependencies
------------
This code uses the following libraries from an online CDN. No installation is required.
* JQuery UI 1.12: https://code.jquery.com/ui/1.12.0/jquery-ui.js
* JQuery 1.12.4: https://code.jquery.com/jquery-1.12.4.js
* Bootstrap 3.0: http://getbootstrap.com/getting-started/#download

Stand Alone
--------
Just open **Budgeter.html** in your favorite browser and start playing!
The following parameters can be edited in the Javascript file:

* FUND_TYPE: The type of fund.
 * "Money" for an unrestricted fund (can be spent in all three categories)
 * "Food" for a food-restricted fund (can be spent only on groceries)
 * "Mobility" for a transportation-restricted fund (can be spent only on transportation).
* FUND_AMOUNT: The quantity of money to be deposited on the fund.
* MIN_SPEND: The minimum quantity that must be spent on Groceries and on Transportation.

In Qualtrics
--------

1. Create a new survey.
2. In the "Survey Flow" section, click "Add Below", then "Embedded Data":
    A. Set the following Embedded Data fields to 0: "FoodValue", "TransportValue", "LeisureValue", "FoodHistory", "TransportHistory", "LeisureHistory", "FoodClicks", "TransportClicks", "LeisureClicks", "TaskDuration".
    B. Add three other Embedded Data fields with the values that you want for "FUND_AMOUNT", "FUND_TYPE", and "MIN_SPEND".
3. In the "Look and Feel" section of the survey:
    A. Select the "Blank (For Styling)" stylesheet
    B. In the "Advanced" Tab, click the "Add Custom CSS" and paste the content of the "Budgeter.css" file in it.
    C. In the "Advanced" Tab, paste the content of the "Header.txt" file in the "Header" text field.
4. Create a new "Text/Graphic" question, and:
    A. Click the "HTML View" button, and paste the content of the "BudgeterQualtrics.html" file in the windows.
    B. Click the "Gear" button, then select "Add Javascript". Paste the content of the "BudgeterQualtrics.js" in the windows.
5. Preview the survey in Qualtrics: everything should be working properly!