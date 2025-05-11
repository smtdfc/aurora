import { RumiousComponent, Fragment, RumiousEmptyProps } from 'rumious';

interface EmptyPlaceholderProps{
  content?:string
}
export class EmptyPlaceholder extends RumiousComponent<EmptyPlaceholderProps> {
  static tagName = "smtdfc-empty-placeholder";
  
  template() {
    return (
      <div class="empty-state d-flex flex-col align-center justify-center p-4 text-muted">
        <i class="material-icons mb-2" style="font-size: 48px;">inbox</i>
        <p>{this.props.content ?? "No content here"}</p>
      </div>
    );
  }
}
