/**
 * RockAnimator — animates floating rocks from Sky.js each frame
 */
export class RockAnimator {
  constructor(scene) {
    this.scene = scene;
  }

  update(t) {
    const rocks = this.scene.userData.rocks;
    if (!rocks) return;
    rocks.forEach(rock => {
      rock.position.y += Math.sin(t * rock.userData.floatSpeed + rock.userData.floatOffset) * 0.003;
      rock.rotation.x += rock.userData.rotSpeed;
      rock.rotation.y += rock.userData.rotSpeed * 0.7;
    });
  }
}
