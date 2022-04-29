import { render } from "@testing-library/react";
import { ActiveLink } from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});
describe('ActiveLink componente',()=>{
    
it("active renders correctly", () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    );
  
    expect(getByText("Home")).toBeInTheDocument();
  });
  
  it("adds active clas if the link is currently active", () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    );
  
    expect(getByText("Home")).toHaveClass("active");
  });
  
})