import { useContext, useEffect, useState } from "react";
import SidebarSection from "../components/organisms/SidebarSection";
import DraggableList from "../components/molecules/DraggableList";
import LegendSection from "../components/organisms/LegendSection";
import SelectableList from "../components/molecules/SelectableList";
import { SurveyContext } from "../context/SurveyContext";
import { initialPreferenceList, Preference } from "../constants/surveyConstants";
import GradientBar from "../components/atoms/GradientBar";
import Colorbox from "../components/atoms/Colorbox";
import { GEOID, MapAttribute, mapSections, THICK_LINE_WEIGHT } from "../constants/mapConstants";
import { MessageContext } from "../context/MessageContext";
import useOpenaiInstruction from "../hooks/useOpenaiInstruction";
import * as mapbox from "../services/mapbox";
import { MapContext } from "../context/MapContext";
import useEffectAfterMount from "../hooks/useEffectAfterMount";
// import CheckboxList from "../components/CheckboxList";

/**
 * Home page component where users select their preferences.
 */
export default function HomePage() {
  const { survey, setSurveyContext } = useContext(SurveyContext);
  const { addMessage, updatePrompt } = useContext(MessageContext);
  const { map, parentLayer } = useContext(MapContext);

  // Currently selected preference.
  const [preference, setPreference] = useState<Preference>(initialPreferenceList.list[0]);

  // Currently selected mapbox layer attribute. 
  const [attribute, setAttribute] = useState<MapAttribute>(
    () => mapSections.find((sec) => sec.id === "home")!.attribute!
  );

  // Get openAI instructions on the current page.
  useOpenaiInstruction(addMessage, updatePrompt);

  // UseMapboxSelectionEffect!!!!!!!!!!!!!!!!!
  // UseMapboxSelectionEffect!!!!!!!!!!!!!!!!!
  useEffectAfterMount(() => {
    if (!map) return;
    const mouseLeaveHandlerWrapper = (event: mapboxgl.MapMouseEvent) => {
      mapbox.hideLineWidth(parentLayer, map);
    }
    const mouseMoveHandlerWrapper = (event: mapboxgl.MapMouseEvent) => {
      const feature = map.queryRenderedFeatures(event.point, {layers: [parentLayer]})[0];
      mapbox.setLineWidthConditional(parentLayer, GEOID, feature.properties![GEOID], THICK_LINE_WEIGHT, map);
    }
    // Add event listeners.
    map.on("mouseleave", parentLayer, mouseLeaveHandlerWrapper);
    map.on("mousemove", parentLayer, mouseMoveHandlerWrapper);

    // Cleanup event listeners on component unmount.
    return () => {
      map.off("mouseleave", parentLayer, mouseLeaveHandlerWrapper);
      map.off("mousemove", parentLayer, mouseMoveHandlerWrapper);
    }
  }, [parentLayer]);


  // Retrieve selected preference from the survey context.
  useEffect(() => {
    const selectedPreference = survey.preferenceList.list.find((item) => item.selected);
    selectedPreference && setPreference(selectedPreference);
  }, [survey]);

  return (
    <>
      {/* Site choice */}
      {/* <SidebarSection title="choose boroughs to discover">
          <CheckboxList name="boroughs" list={survey.boroughList} setSurveyContext={setSurveyContext} />
        </SidebarSection> */}

      <SidebarSection title="rank site conditions in priority to expand healthcare in shortage areas">
        <DraggableList
          list={survey.preferenceList.list}
          setSurveyContext={setSurveyContext}
          displayIcon={false}
          displayRanking
          selectable
        />
      </SidebarSection>

      <LegendSection title={preference.category as string}>
        <SelectableList
          list={preference.subCategories}
          setAttribute={setAttribute}
          mappable
        />
        <GradientBar bound={attribute.bound} unit={attribute.unit} />
        <Colorbox label={"non-shortage areas"} />
      </LegendSection>
    </>
  );
}
