import React from "react";
import _ from "lodash";
import moment from "moment";
import Markdown from "react-markdown";
import RichTextEditor, {RichTextEditorValue} from "react-rte";

import {AsyncWrapper} from "./react-helpers/AsyncWrapper";
import {Nonce} from "./react-helpers/Nonce";
import {Permissions} from "./util/Permissions";
import {Button, ButtonGroup, Col, Form, Modal, Row} from "react-bootstrap";
import {Route} from "react-router";
import {history} from "./react-helpers/history";
import {SmartForm} from "./react-helpers/form/SmartForm";
import {DateTimeField} from "./react-helpers/form/DateTimeField";
import {StringField} from "./react-helpers/form/StringField";
import {AsyncButton} from "./react-helpers/AsyncButton";
import {auth} from "./auth";
import "./NewsPage.scss";
import {Confirm} from "./util/Confirm";
import {CheckboxField} from "./react-helpers/form/CheckboxField";
import {StateBind} from "./react-helpers/bind/StateBind";

// monkey-patch console.warn to hide Immutable Iterable.length warning,
// which is due to the fact that Draft-js can't update Immutable version for over a year
// https://github.com/facebook/draft-js/issues/950
if (console && console.warn) {
  let origConsoleWarn = console.warn;
  console.warn = function() {
    if (!(arguments[0] && typeof arguments[0] === "string" && /iterable.length has been deprecated/.test(arguments[0]))) {
      origConsoleWarn.apply(this, arguments);
    }
  }
}

interface NewsPost {
  id: number;
  timestamp: number;
  timestampEnd?: number;
  subject: string;
  body: string;
  urgent: boolean;
}

export class NewsPage extends React.Component<{}> {
  render() {
    return (
      <div className="container-fluid news-page">
        <Nonce>{({nonce, incrementNonce}) =>
          <React.Fragment>
            {/*<Route*/}
            {/*  path="/news/:postId"*/}
            {/*  render={(props) =>*/}
            {/*    <NewsEditPopup*/}
            {/*      postId={props.match.params.postId === "new" ? "new" : Number(props.match.params.postId)}*/}
            {/*      onDone={() => {*/}
            {/*        incrementNonce();*/}
            {/*        history.push("/news");*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  }*/}
            {/*/>*/}

            <Row>
              {/*<Col md={3}>*/}
              {/*  <h2>21 game</h2>*/}
              {/*  <br/>*/}

              {/*</Col>*/}
              <Col md={9}>
                <AsyncWrapper
                  data={{
                    news: { url: "/news" }
                    //permissions: { url: "/user/permissions" }
                  }}
                  nonce={nonce}
                  render={(data: {
                    news: NewsPost[]
                    //permissions: string[]
                  }) => {
                    return(<div><h1>again</h1></div>)
                  }
                  }
                  />
                {/*    //let canEdit = Permissions.testPath(data.permissions, "/admin/news");*/}
                {/*    //     let canEdit = true;*/}
                {/*    //     return (*/}
                {/*    //       <React.Fragment>*/}
                {/*    //         <h2>*/}
                {/*    //           Новости*/}
                {/*    //           {*/}
                {/*    //             canEdit &&*/}
                {/*    //             <Button*/}
                {/*    //               bsSize="xs"*/}
                {/*    //               bsStyle="default"*/}
                {/*    //               style={{marginLeft: "1em"}}*/}
                {/*    //               onClick={() => history.push("/news/new")}*/}
                {/*    //             >*/}
                {/*    //               <i className="fa fa-plus" />*/}
                {/*    //               Добавить новость*/}
                {/*    //             </Button>*/}
                {/*    //           }*/}
                {/*    //         </h2>*/}
                {/*    //         {*/}
                {/*    //           data.news.map(post =>*/}
                {/*    //             <div key={post.id} className={"post" + (post.urgent ? " urgent" : "") + ((post.timestampEnd < Date.now())? " gray": "")} >*/}
                {/*    //               <h3>*/}
                {/*    //                 {post.subject}*/}
                {/*    //                 {*/}
                {/*    //                   canEdit &&*/}
                {/*    //                   <ButtonGroup style={{marginLeft: "0.5em"}} className="post-edit-buttons">*/}
                {/*    //                     <Button*/}
                {/*    //                       bsSize="xs"*/}
                {/*    //                       bsStyle="default"*/}
                {/*    //                       onClick={() => history.push(`/news/${post.id}`)}*/}
                {/*    //                     >*/}
                {/*    //                       <i className="fa fa-edit"/>*/}
                {/*    //                     </Button>*/}
                {/*    //                     <AsyncButton*/}
                {/*    //                       bsSize="xs"*/}
                {/*    //                       bsStyle="default"*/}
                {/*    //                       onClick={() =>*/}
                {/*    //                         Confirm.confirm({*/}
                {/*    //                           title: "Удалить новость?",*/}
                {/*    //                           content: "Точно удалить новость?",*/}
                {/*    //                           confirmTitle: "Удалить",*/}
                {/*    //                           btnClass: "btn-danger"*/}
                {/*    //                         }).then(() => auth.axios().delete(`/news/${post.id}`))*/}
                {/*    //                       }*/}
                {/*    //                       onSuccess={() => incrementNonce()}*/}
                {/*    //                     >*/}
                {/*    //                       <i className="fa fa-trash"/>*/}
                {/*    //                     </AsyncButton>*/}
                {/*    //                   </ButtonGroup>*/}
                {/*    //                 }*/}
                {/*    //               </h3>*/}
                {/*    //               <div style={{color: "gray", fontStyle: "italic"}}>*/}
                {/*    //                 {moment(post.timestamp).format("DD.MM.YYYY HH:mm")}*/}
                {/*    //               </div>*/}
                {/*    //               <div style={{marginTop: "0.5em"}}>*/}
                {/*    //                 <Markdown source={post.body} />*/}
                {/*    //               </div>*/}
                {/*    //             </div>*/}
                {/*    //           )*/}
                {/*    //         }*/}
                {/*    //       </React.Fragment>*/}
                {/*    //     );*/}
                {/*//   }}*/}
                {/*//*/}
                {/*// />*/}
              </Col>
            </Row>
          </React.Fragment>
        }</Nonce>
      </div>
    );
  }
}

interface NewsEditPopupProps {
  postId: number | "new";
  onDone: () => void;
}
class NewsEditPopup extends React.Component<NewsEditPopupProps> {
  render() {
    return (
      <Modal show={true} onHide={this.props.onDone} bsSize="large">
        <AsyncWrapper
          data={{
            post: this.props.postId === "new"
              ? { data: { id: 0, timestamp: Date.now() } }
              : { url: `/news/${this.props.postId}` }
          }}
          render={(data: { post: NewsPost}) =>
            <NewsEditForm
              post={data.post}
              onDone={this.props.onDone}
            />
          }
        />
      </Modal>
    );
  }
}

interface NewsEditFormProps {
  post: NewsPost;
  onDone: () => void;
}
interface NewsEditFormState {
  post: NewsPost;
  bodyRichValue: RichTextEditorValue;
}
class NewsEditForm extends React.Component<NewsEditFormProps, NewsEditFormState> {
  constructor(props: NewsEditFormProps) {
    super(props);
    this.state = {
      post: _.cloneDeep(props.post),
      bodyRichValue: RichTextEditor.createValueFromString(props.post.body || "", "markdown")
    };
  }
  render(): React.ReactNode {
    return SmartForm.of<NewsPost>({
      bind: StateBind.of(this).get("post"),
      skipFormTag: true,
      children: ({item, isFormValid}) =>
        <React.Fragment>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.post.id === 0 ? "Добавление новости" : "Редактирование новости"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal onSubmit={(e) => e.preventDefault()}>
              <DateTimeField
                title="Дата публикации"
                bind={item.get("timestamp")}
                required
              />
              <DateTimeField
                title="Дата окончания публикации"
                bind={item.get("timestampEnd")}
               />
              <StringField
                title="Заголовок"
                bind={item.get("subject")}
                required
              />
              <CheckboxField
                title="Выделить красным"
                bind={item.get("urgent")}
              />
              <RichTextEditor
                value={this.state.bodyRichValue}
                onChange={(v: RichTextEditorValue) => {
                  this.setState({bodyRichValue: v});
                  item.get("body").setValue(v.toString("markdown"));
                }}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="default"
              onClick={this.props.onDone}
            >Отмена</Button>

            <AsyncButton
              bsStyle="primary"
              disabled={!isFormValid || !this.state.post.body}
              onClick={() => auth.axios().post("/news", this.state.post)}
              onSuccess={this.props.onDone}
            >Опубликовать</AsyncButton>
          </Modal.Footer>
        </React.Fragment>
    });
  }
}
