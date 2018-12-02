import React, {Component} from "react";
import {Icon} from "antd";

class Landing extends Component{
    render(){
      return(
            <div>
                <div className="landing-block">
                    <h3> What's Writango?</h3>
                    <p>Writango is just another writing and publishing platform, but with a minor difference.</p>
                    <p>It lets your readers <Icon style={{fontSize: "22px"}} type="backward"></Icon> play <Icon style={{fontSize: "22px"}} type="forward"></Icon> your content sentence by sentence instead of throwing up a big chunk of text on-screen.</p>
                </div>
                <div className="landing-block">
                    <h3> Write & Publish. No sign-up required. </h3>
                    <p>
                        Use Writango when you want to quickly write something and present it to an audience. You don't even have to sign-up or sign-in. 
                        <a href="#">Take a look.</a>
                    </p>
                </div>
                <div className="landing-block">
                    <h3> It's free & open-sourced. </h3>
                    <p>
                        There's no fee for hosting your writes. Text hosting is cheap. When the day arrives when the hosting charges surpasses the threshold, you'll be able to export your writes and/or host your own Writango. 
                    </p>
                    <p>The source code is open-sourced at <a href="#">github.com/joelewis/writango</a></p>
                </div>
            </div>
      );
    }
}

export default Landing