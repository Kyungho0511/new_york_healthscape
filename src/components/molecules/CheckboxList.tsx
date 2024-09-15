import styles from "./CheckboxList.module.css";
import { BoroughList, ClusterCheckboxItem, ClusterList } from "../../constants/surveyConstants";
import Colorbox from "../atoms/Colorbox";
import { Hex } from "../../constants/mapConstants";
import { useState } from "react";

type CheckboxListProps = {
  name: string;
  list: CheckboxItem[];
  colorbox?: boolean;
  setSurveyContext: (newSurveyElement: BoroughList | ClusterList) => void;
};

export type CheckboxItem = {
  name: string;
  checked: boolean;
  id: string;
  color?: Hex;
}

export default function CheckboxList({ name, list, colorbox, setSurveyContext }: CheckboxListProps) {
  const [type, setType] = useState<"cluster" | "borough">(() => {
    if (name === "boroughs") return "borough";
    if ([ "cluster1", "cluster2", "cluster3" ].includes(name)) return "cluster";
    throw new Error("Invalid name");
  });

  // Handle uncontrolled checkbox change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const updatedList = [...list];
      updatedList[index] = { ...updatedList[index], checked: event.target.checked };

      // Update Boroughs in the survey context
      if (type === "borough") {
        const newBoroughs: BoroughList = { name: "boroughs", list: updatedList};
        setSurveyContext(newBoroughs);
      } 
      
      // Update ClusterList in the survey context
      if (type === "cluster") {
        const newCluster: ClusterList = {
          name: name as "cluster1" | "cluster2" | "cluster3",
          list: updatedList as ClusterCheckboxItem[],
        };
        setSurveyContext(newCluster);
      }
  }

  return (
    <ul className={styles.list}>
      {list.map((item, index) => (
        <li key={item.id}>
          <label className={styles.label} >
            <input
              className={styles.input}
              type="checkbox"
              name={name}
              value={item.name}
              checked={item.checked}
              onChange={(event) => handleChange(event, index)}
            />
            <span className={styles.indicator}></span>
            {colorbox ? (
              <Colorbox label={item.name} color={item.color} fontSize={"1rem"} />
            ) : (
              <p>{item.name}</p>
            )}
          </label>
          {type === "cluster" && <div className={styles.text}>{item.reasoning}</div>}
        </li>
      ))}
    </ul>
  );
}