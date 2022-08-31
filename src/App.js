import React, {useEffect, useState} from "react";
import logo from './logo.svg';
import './App.css';
import NavBar from "./NavBar";
import Map from "./Map";
import {Avatar, Card, Col, Divider, List, Row, Tabs} from "antd";
import axios from "axios";

const key = "KLH5MI68WDOJDZP3";
const { TabPane } = Tabs;
function App() {

    var url = `https://api.thingspeak.com/channels/1845285/feeds.json?api_key=${key}`

    const [feedsArray, setFeedsArray] = useState([]);
    const dataArray = [
        {
            title: 'Altitude',
            value: "1500ft AMSL"
        },
        {
            title: 'ETA',
            value: "12:30"
        },
        {
            title: 'Speed',
            value: "3m/s"
        },
        {
            title: 'Flags found',
            value: feedsArray.length
        },
    ];
    useEffect(() => {
        var tempArray = []
        axios.get(url, {params: {}})
            .then(function (response) {
                console.log(response.data.feeds);


                response.data.feeds.map((item) => {
                    console.log(item);
                    tempArray.push(
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [ parseFloat(item.field1), parseFloat(item.field2) ]
                            },
                            'properties': {
                                'title': 'rescue point',
                                'desc' : 'some desc'
                            }
                        }
                    );
                });
                console.log(tempArray);
                setFeedsArray([...tempArray]);
            });

        console.log(tempArray);

    }, []);
    const FloatingObjects = () => (
        <div className="down">
            <div className="site-card-wrapper mt-5 mx-2 bg-white border border-4 text-start rounded">
                <Tabs type="card">
                    <TabPane tab={<b>Details</b>} key="1">
                        <div className="px-2 ml-5">
                            <List
                                itemLayout="horizontal"
                                dataSource={dataArray}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={item.title}
                                            description={item.value}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    </TabPane>
                    <TabPane tab={<b>Flags</b>} key="2">
                        <div className="px-2 ml-5">
                            <List
                                itemLayout="horizontal"
                                dataSource={feedsArray}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={item.properties.title}
                                            description={item.geometry.coordinates}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    </TabPane>

                </Tabs>

            </div>
        </div>
    );


    return (
    <div className="App">
        <NavBar/>
        <FloatingObjects className="mt-5"/>
        <Map json={feedsArray}/>
    </div>
  );
}

export default App;
