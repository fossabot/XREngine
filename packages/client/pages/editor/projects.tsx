import React, { Component } from "react";
import styled from "styled-components";
import { withApi } from "../../components/editor/ui/contexts/ApiContext";
import { Button, MediumButton } from "../../components/editor/ui/inputs/Button";
import { connectMenu, ContextMenu, MenuItem } from "../../components/editor/ui/layout/ContextMenu";
import { ErrorMessage, ProjectGrid, ProjectGridContainer, ProjectGridContent, ProjectGridHeader, ProjectGridHeaderRow } from "../../components/editor/ui/projects/ProjectGrid";
import templates from "../../components/editor/ui/projects/templates";
import Api from "../../components/editor/api/Api";
import { Router, withRouter } from "next/router";
import { ThemeContext } from "../../components/editor/ui/theme";
export const ProjectsSection = (styled as any).section<{ flex?: number }>`
  padding-bottom: 100px;
  display: flex;
  flex: ${props => (props.flex === undefined ? 1 : props.flex)};

  &:first-child {
    padding-top: 100px;
  }

  h1 {
    font-size: 36px;
  }

  h2 {
    font-size: 16px;
  }
`;
export const ProjectsContainer = (styled as any).div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 20px;
`;
const WelcomeContainer = styled(ProjectsContainer)`
  align-items: center;
  & > * {
    text-align: center;
  }
  & > *:not(:first-child) {
    margin-top: 20px;
  }
  h2 {
    max-width: 480px;
  }
`;
export const ProjectsHeader = (styled as any).div`
  margin-bottom: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const contextMenuId = "project-menu";
type ProjectsPageProps = {
  api: Api;
  history: object;
  router: Router;
};
type ProjectsPageState = { projects: any } & {
  error: any;
  loading: boolean;
} & ((error: any) => any) & {
    projects: any[];
    loading: any;
    isAuthenticated: any;
    error: null;
  };
class ProjectsPage extends Component<ProjectsPageProps, ProjectsPageState> {
  constructor(props: ProjectsPageProps) {
    super(props);
    const isAuthenticated = this.props.api.isAuthenticated();
    this.state = {
      projects: [],
      loading: false,
      isAuthenticated,
      error: null
    };
  }
  componentDidMount() {
    console.warn("PROJECTS PAGE PROPS: ", this.props);
    // We dont need to load projects if the user isn't logged in
    if (this.state.isAuthenticated) {
      this.props.api.getProjects()
        .then(projects => {
          this.setState({
            projects: projects.map(project => ({
              ...project,
              url: `/editor/projects/${project.project_id}`
            })),
            loading: false
          });
        })
        .catch(error => {
          console.error(error);
          if (error.response && error.response.status === 401) {
            // User has an invalid auth token. Prompt them to login again.
            // return (this.props as any).history.push("/", { from: "/projects" });
            return this.props.router.push("/editor/projects");
          }
          this.setState({ error, loading: false });
        });
    }
  }

  static contextType = ThemeContext

  onDeleteProject = project => {
    this.props.api
      .deleteProject(project.project_id)
      .then(() =>
        this.setState({
          projects: this.state.projects.filter(
            (p) => p.project_id !== project.project_id
          ),
        })
      )
      .catch((error) => this.setState({ error }));
  };
  routeTo = (route: string) => () => {
    this.props.router.push(route);
  }
  renderContextMenu = props => {
    return (
      <>
      { /* ts-ignore */ }
      <ContextMenu>
        <MenuItem onClick={e => this.onDeleteProject(props.trigger.project)}>
          Delete Project
        </MenuItem>
      </ContextMenu>
      </>
    );
  };
  ProjectContextMenu = connectMenu(contextMenuId)(this.renderContextMenu);
  render() {
    const { error, loading, projects } = this.state;
    const ProjectContextMenu = this.ProjectContextMenu;
    const topTemplates = [];
    for (let i = 0; i < templates.length && i < 4; i++) {
      topTemplates.push(templates[i]);
    }
    return (
      <>
        <main>
          {(projects.length === 0 && !loading) ? (
            <ProjectsSection flex={0}>
              <WelcomeContainer>
                <h1>Welcome</h1>
                <h2>
                  If you&#39;re new here we recommend going through the
                  tutorial. Otherwise, jump right in and create a project from
                  scratch or from one of our templates.
                </h2>
                <MediumButton onClick={this.routeTo("/editor/tutorial")}>
                  Start Tutorial
                </MediumButton>
              </WelcomeContainer>
            </ProjectsSection>
          ) : null}
          <ProjectsSection>
            <ProjectsContainer>
              <ProjectsHeader>
                <h1>Projects</h1>
              </ProjectsHeader>
              <ProjectGridContainer>
                <ProjectGridHeader>
                  <ProjectGridHeaderRow />
                  <ProjectGridHeaderRow>
                    <Button onClick={this.routeTo("/editor/create")}>
                      New Project
                    </Button>
                  </ProjectGridHeaderRow>
                </ProjectGridHeader>
                <ProjectGridContent>
                  {error && <ErrorMessage>{error.message}</ErrorMessage>}
                  {!error && (
                    <ProjectGrid
                      loading={loading}
                      projects={projects}
                      // newProjectPath="/editor/templates"
                      newProjectPath="/editor/create"
                      newProjectLabel="New Project"
                      contextMenuId={contextMenuId}
                    />
                  )}
                </ProjectGridContent>
              </ProjectGridContainer>
            </ProjectsContainer>
          </ProjectsSection>
          <ProjectContextMenu />
        </main>
      </>
    );
  }
}

export default withRouter(withApi(ProjectsPage));
