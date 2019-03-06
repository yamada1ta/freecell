import { Tween } from '@tweenjs/tween.js'

export class AnimationManager {
  onChange = () => { };

  private activeNum = 0;

  get count() {
    return this.activeNum;
  }

  add(value: Tween, interval: number) {
    const delay = interval * this.activeNum;

    const end = this.addProgress(value, delay);
    value.start();

    return { end, delay };
  }

  chain(value: Tween, org: Tween, orgTime: number, interval: number) {
    const delay = interval * this.activeNum - orgTime;

    const end = this.addProgress(value, delay >= 0 ? delay : 0);
    org.chain(value);

    return { end, delay };
  }

  private addProgress(value: Tween, delay: number) {
    const end = new Tween()
      .to({}, 0)
      .onComplete(() => {
        this.activeNum--;
        this.onChange();
      });

    value
      .delay(delay)
      .chain(end);

    this.activeNum++;
    this.onChange();

    return end;
  }
}