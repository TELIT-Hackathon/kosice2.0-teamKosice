import React from 'react';

function Element(props){
    return <>
    <div className={"element-container"}>
        <img src={props.ImgUrl} className={"element-img"}></img>
        <div className={"element-data-container"}>
            <div className={"element-title-container"}>
                <span className={"element-title"}>{props.Title}</span>
                <span className={"element-score"}>{props.Score}</span>
            </div>
            <span className={"element-description"}>{props.Description}</span>
        </div>
    </div>
    </>
}

function MainPage(props){
    
    const [desc,setDesc] = React.useState();

    const [data,setData] = React.useState([]);
    const [displayData,setDisplayData] = React.useState(false);


    let postRequest = (description)=>{
        console.log("clik");
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
            })
            .catch(error => {
                console.error('There was an error!', error);
                setDisplayData(false);
            });
    }   

    return <>
        <div className={"search-container"}>
            <textarea onChange={(e)=>{setDesc(e.target.value)}}>

            </textarea>
            <button onClick={(e)=>{postRequest(desc)}}>Match! :D</button>
        </div>
        <div className={"data-container"}>
        {
            (displayData)?
            <>
                {
                    data.map((e,id)=><Element Title={e.title} ImgUrl={e.image} Description={e.description} Score={e.score} key={id}/>)
                }
            </>:<>
                <span className={"no-result"}>No result</span>
            </>
        }
        </div>
    </>
}

export default MainPage;