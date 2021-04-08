# Title
<p>Stock and News Application</p>
<p>This application allows the user to search for stock information and news on companies of their choice.</p>
<a href="https://stock-and-news-tracker.herokuapp.com/"><img src="public\images\Capture30.png" height="250px" width="250px"></img></a>

# Installation
<p>A live deployment of this web application can be found here: <a href="https://stock-and-news-tracker.herokuapp.com/">https://stock-and-news-tracker.herokuapp.com/</a></p>

<p>To install locally please use the following steps:</p>
<ol>
<li>Download the files off of GitHub</li>
<li>Install and setup Node.js</li>
<li>Open the files in Visual Studio Code</li>
<li>Open your terminal at the base level (ctrl + ` ) and run the command npm install</li>
<li>Run the terminal command npm start</li>
<li>The page is now available on your device at locahost:5000</li>
</ol>

## Built with
<ul>
<li>Bootstrap - CDN link included</li>
<li>jQuery - CDN link included</li>
<li>popper.js - CDN included</li>
<li>Node.js and these packages</li>
    <ul>
    <li>Express.js - Installed via Node</li>
    <li>Axios - Installed via Node</li>
    <li>Express-handlebars - Installed via Node</li>
    <li>Express-session - Installed via Node</li>
    <li>Promise - Installed via Node</li>
    <li>Request - Installed via Node</li>
    <li>Body-parser - Installed via Node</li>
    </ul>
</ul>

## Code Overview
<p>Most of the work is done with the index.js file which sets up the server/routing, contains outside API calls, and sets up Handlebars user interface. The pages are then created from the public with the html files, and the views file which contains the matching handlebars for each page.</p>