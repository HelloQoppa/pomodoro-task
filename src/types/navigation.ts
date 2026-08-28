export type RootTabParamList = {
  Timer:
    | {
        taskId: string;
        taskTitle: string;
      }
    | undefined;
  Tasks: undefined;
  Analytics: undefined;
  Settings: undefined;
};
