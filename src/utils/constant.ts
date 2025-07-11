import { IReactSelectOptions } from "../types/template";

export const BackendTechnologiesItems: IReactSelectOptions[] = [
  { label: "Please Select", value: "-", isDisabled: true },
  { label: ".NET", value: ".NET", isDisabled: false },
  { label: ".NET Core", value: ".NET Core", isDisabled: false },
  { label: "Web API", value: "Web API", isDisabled: false },
  { label: "C#", value: "C#", isDisabled: false },
  { label: "SQL Server", value: "SQL Server", isDisabled: false },
  { label: "PostgreSQL", value: "PostgreSQL", isDisabled: false },
  {
    label: "Entity Framework Core",
    value: "Entity Framework Core",
    isDisabled: false,
  },
  { label: "ASP.NET MVC", value: "ASP.NET MVC", isDisabled: false },
  { label: "ASP.NET", value: "ASP.NET", isDisabled: false },
  { label: "REST APIs", value: "REST APIs", isDisabled: false },
  { label: "GIT", value: "GIT", isDisabled: false },
];

export const FrontechnologiesItems: IReactSelectOptions[] = [
  { label: "Please Select", value: "-", isDisabled: true },
  { label: "HTML5", value: "HTML5", isDisabled: false },
  { label: "CSS3", value: "CSS3", isDisabled: false },
  { label: "JAVASCRIPT", value: "JAVASCRIPT", isDisabled: false },
  { label: "REACT", value: "REACT", isDisabled: false },
  { label: "Angular 2+", value: "Angular 2+", isDisabled: false },
  { label: "Bootstrap", value: "Bootstrap", isDisabled: false },
  { label: "Tailwind CSS", value: "Tailwind CSS", isDisabled: false },
  { label: "Responsive Design", value: "Responsive Design", isDisabled: false },
];
