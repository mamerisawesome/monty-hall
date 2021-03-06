import React, {
  FC,
  ChangeEvent,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import StepContext from "../../contexts/step";
import styled from "styled-components";
import {
  Input,
  Button,
  Title,
  Text,
} from "../../components/htmlAtoms";

type Page2Props = (
  FC<{ className?: string }>
  | void
);

const getInputsSummation = (data: number[]|undefined[]) => {
  let areNumbers = true;
  for (let idx = 0; idx < data.length; idx += 1) {
    if (typeof data[idx] !== "number") {
      areNumbers = false;
      break;
    }
  }

  if (!areNumbers) {
    return 0;
  }

  return (data as number[]).reduce((acc: number, val: number|undefined): number => (
    val ? (acc + val) : acc
  ), 0);
};

const Page2Component: Page2Props = ({ className }) => {
  const { step, dispatch } = useContext(StepContext);
  const [isValid, setIsValid] = useState<Boolean>(false);
  const [inputVals, setInputVals] = useState<number[]|undefined[]>([]);

  const handleGetSummation = useCallback(() => {
    setIsValid(getInputsSummation(inputVals) === 100);
  }, [inputVals]);

  useEffect((): void => {
    if (inputVals.length === step.parts) {
      handleGetSummation();
    }
  }, [inputVals, step.parts, handleGetSummation]);

  if (step.currentStep !== 2) {
    if (inputVals.length) {
      setInputVals([]);
      setIsValid(false);
    }
    return null;
  }

  const onInputChange = (id: number) => {
    return (e: ChangeEvent<HTMLInputElement>): void => {
      const tempVals = inputVals.slice();
      tempVals[id] = Number(e.target.value);
      if (e.target.value === "") {
        tempVals[id] = undefined;
      }
      setInputVals(tempVals);
    };
  }

  return (
    <div className={className}>
      <Title.H3>
        Summation of Parts
      </Title.H3>
      <Text.Paragraph>For each box, input a number from 0 to 100. For you to proceed, the summation of all boxes should be 100. All boxes should have an input to proceed.</Text.Paragraph>
      <div>
        {Array.from(Array(step.parts).keys()).map((part, id) => (
          <Input.Number
            key={id}
            label={`Part ${part+1} %`}
            onChange={onInputChange(id)}
            min={0}
            max={100}
          />
        ))}
      </div>
      <div>
        <Button.Warning onClick={() => {dispatch({type: "previous"})}}>
          Previous
        </Button.Warning>
        <Button.Primary
          disabled={!isValid}
          onClick={() => {dispatch({type: "next"})}}
        >
          Next
        </Button.Primary>
      </div>
    </div>
  );
};

export const Page2 = styled(Page2Component)``;
