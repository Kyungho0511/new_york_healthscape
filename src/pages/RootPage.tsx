import { Outlet } from "react-router-dom";
import Footbar from "../components/organisms/Footbar";
import Map from "../components/organisms/Map";
import { SurveyContextProvider } from "../context/SurveyContext";
import MessageBox from "../components/molecules/MessageBox";
import Sidebar from "../components/organisms/Sidebar";
import { MessageContextProvider } from "../context/MessageContext";
import { MapContextProvider } from "../context/MapContext";

export default function RootPage() {
  return (
    <>
      <MapContextProvider>
        <Map />
        <MessageContextProvider>
          <Sidebar>
            <MessageBox />
            <SurveyContextProvider>
              <Outlet />
            </SurveyContextProvider>
          </Sidebar>
          <Footbar />
        </MessageContextProvider>
      </MapContextProvider>
    </>
  )
}