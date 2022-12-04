import React from 'react';

function Element(props){
    const [moreInfo,setMoreInfo] = React.useState(false);
    return <>
    <div className={"element-container"}>
        <img src={props.ImgUrl} className={"element-img"}></img>
        <div className={"element-data-container"}>
            <div className={"element-title-container"}>
                <span className={"element-title"}>{props.Title}</span>
                <span className={"element-score"}>{props.Score}</span>
            </div>
            <span className={`element-description ${(moreInfo)?"active":""}`}>{props.Description}</span>
            {/* <span className={"element-more"} onClick={(e)=>{setMoreInfo(!moreInfo)}}> {(moreInfo)?"↑":"↓"}</span> */}
        </div>
    </div>
    </>
}

function MainPage(props){
    
    const [desc,setDesc] = React.useState();

    const [data,setData] = React.useState([]);
    const [displayData,setDisplayData] = React.useState(false);
    const [loadingData,setLoadingData] = React.useState(false);


    let postRequest = (description)=>{
        setLoadingData(true);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ desc:`${description}`})
        };
        let request = new Request('/api/getData',requestOptions)
        fetch(request)
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                } else {
                    throw new Error('Error');
                }
            })
            .then(response => {
                let d = Object.values(response);
                console.log(d);
                console.log(d.length);
                if(d.length > 0){
                    setData(d);
                    setDisplayData(true);
                }else{
                    setDisplayData(false);
                }
                setLoadingData(false);
            })
            .catch(error => {
                setLoadingData(false);
                console.error('There was an error!', error);
                setDisplayData(false);
            });
    }   

    return <>
        <div className={"search-container"}>
            <div className={"presets-container"}>
                <button className={"preset"} onClick={(e)=>{setDesc(`Overview The goal of this project is to create a social app that can be used for dating people. The app should provide users with an easy and intuitive way to find and connect with potential partners. 2. Scope The scope of this project includes the development of the following features: • User accounts: users should be able to create profiles with basic information, including age, gender, location, interests, and pictures. Users should also be able to search for other users based on these criteria. • Messaging: users should be able to send and receive messages to/from other users. • Matching: the app should have an algorithm that is able to match users based on their preferences. • Notifications: users should be able to receive notifications when they receive messages or when they are matched with someone. • Security: the app should have security measures in place to protect user data and ensure user privacy. 3. Design The app should have an attractive, modern design that is optimized for both desktop and mobile use. 4. Technology The app should be developed using the latest technologies, including HTML, CSS, JavaScript, React, and Node.js`)}}>Dating app</button>
                <button className={"preset"} onClick={(e)=>{setDesc(`Project Requirements for Sports App (Coaching Portal) Objective: To develop a sports app to serve as a coaching portal for the sports environment, particularly Floorball, and to facilitate e-learning for its users. Scope: The scope of the project will include the development of a sports app that can be used for coaching and e-learning purposes. The app will be designed with the ability to facilitate Floorball-specific training and coaching activities, as well as to provide access to educational resources and content related to Floorball. Technologies: The project will need to make use of the following technologies: .NET, Big Data, AI, AR, IoT. Timeline: The timeline for the project is three months. Delivery: The project will be delivered as a Minimum Viable Product (MVP). Areas: Sports, Floorball, Coaching & learning.`)}}>Coaching portal</button>
                <button className={"preset"} onClick={(e)=>{setDesc(`TakeAway Taxi is a Mobile application that provide services to
passengers and taxi drivers .The TakeAway Taxi connects
between passengers and taxi drivers using GPS system and
enable passengers to order a taxi with their Smartphone .The
application show to passengers nearby taxies to his location .The
project has two parts the first one is an application run on
mobile device and the second is a server on MySQL server.
The importance of this application is managing passengers'
booking in quick and easy way with shortest time possible
without any need for third party to do this work. This project
also allows passengers to stay in control with this real-time
mobile application by tracking their rides on the way to their
locations and by notifying drivers that there exists a request. The
main objectives of this project are showing the nearby taxies to
user location on map and enable user to order a taxi and
tracking the arrival of the taxi.
We will develop this application in order to work on mobile
devices so we will mobile development language and for server
part we will use PHP.`)}}>Taxi Mobile application</button>
                {/* <button className={"preset"} onClick={(e)=>{setDesc(``)}}>4</button> */}
            </div>
            <textarea className={"search"} value={desc} onChange={(e)=>{setDesc(e.target.value)}} onKeyDown={(e)=>{if(e.keyCode == 13){console.log(e)}}}>
            </textarea>
            <button className={"match"}  onClick={(e)=>{postRequest(desc)}}>Match :D</button>
        </div>
        <hr className={"hr"}/>
        <div className={"data-container"}>
        {
            (loadingData)?
                <>
                    <span className={"loading error"}>Loading Data</span> 
                </>:<>
                {
                (displayData)?
                    <>
                        {
                            data.map((e,id)=><Element Title={e.title} ImgUrl={e.image} Description={e.description} Score={e.score} key={id}/>)
                        }
                    </>:<>
                        <span className={"no-result error"}>No result</span>
                    </>
                }</>
        }
        </div>
    </>
}

export default MainPage;