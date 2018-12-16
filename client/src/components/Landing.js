import React, {Component} from "react";
import {Icon, Row, Col} from "antd";
import { Link } from "react-router-dom";

class Landing extends Component{
    createDraft() {
        Model.createDraft().then((resp) => {
            console.log(resp);
            var post = resp;
            if (post.fields.author) {
                var edit_url = "/writes/@"+post.fields.author.username + "/edit/" + post.fields.slug;
            } else {
                var edit_url = "/writes/@" + post.fields.session + "/edit/" + post.fields.slug;
            }
            window.location.href = edit_url;
        })
    }

    render(){
      return(
            <div style={{width: '80%', margin: 'auto'}}>
                <div className="landing-block">
                <Row>
                    <Col span={14}>
                        <h3> What's Writango?</h3>
                        <p>Writango is just another writing and publishing platform, but with a minor difference.</p>
                        <p>It lets your readers <Icon style={{fontSize: "22px"}} type="backward"></Icon> play <Icon style={{fontSize: "22px"}} type="forward"></Icon> your content sentence by sentence instead of throwing up a big chunk of text on-screen.</p>
                        <p><a onClick={this.createDraft}>Try now.</a></p>
                    </Col>
                    <Col span={10}>
                        <img style={{height: '400px'}} src={window.STATIC_HOST+'/writango/static/img/demo.gif'}></img>
                    </Col>
                </Row>
                </div>
                <div className="landing-block">
                    <h3> Write & Publish. No sign-up required. </h3>
                    <p>
                        Use Writango when you want to quickly write something and present it to an audience. You don't even have to sign-up or sign-in.
                        <Link to="/writes/@joelewis/play/whats-writango-6668324975"> See demo.</Link>
                    </p>
                </div>
                <div className="landing-block">
                    <h3> It's free & open-sourced. </h3>
                    <p>
                        There's no fee for hosting your writes. Text hosting is cheap.<br /> 
                        You can also export your writes and/or host your own Writango. 
                    </p>
                    <p>The source code is open-sourced at <a href="https://github.com/joelewis/writango">github.com/joelewis/writango</a></p>
                </div>
            </div>
      );
    }
}

export default Landing