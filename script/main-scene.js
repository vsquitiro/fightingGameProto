/** @type {import("../typings/phaser")} */

import globalConfig from './global-config.js';
import SystemState from './state-machine.js';
// import {
//     scripts
// } from './scripts.js';

// import { Chaos } from './chaos.js';

class MainScene extends Phaser.Scene {
    init() {
        console.log("Main Scene Init");
        // this.chaos = new Chaos();
    }
    create() {
        // this.nextRest = 'restDown';
        // this.spriteIdx = [0,3,12,15,24];

        // this.anims.create({
        //     key: 'left',
        //     frames: this.anims.generateFrameNumbers('player', {start:8, end:11}),
        //     frameRate: 8,
        //     repeat: -1
        // });

        // this.anims.create({
        //     key: 'right',
        //     frames: this.anims.generateFrameNumbers('player', {start:12, end:15}),
        //     frameRate: 8,
        //     repeat: -1
        // });

        // this.anims.create({
        //     key: 'up',
        //     frames: this.anims.generateFrameNumbers('player', {start:4, end:7}),
        //     frameRate: 8,
        //     repeat: -1
        // });

        // this.anims.create({
        //     key: 'down',
        //     frames: this.anims.generateFrameNumbers('player', {start:0, end:3}),
        //     frameRate: 8,
        //     repeat: -1
        // });        

        // this.anims.create({
        //     key: 'restLeft',
        //     frames: [{key: 'player', frame:8}],
        //     frameRate: 20,
        // });

        // this.anims.create({
        //     key: 'restRight',
        //     frames: [{key: 'player', frame:13}],
        //     frameRate: 20,
        // });

        // this.anims.create({
        //     key: 'restUp',
        //     frames: [{key: 'player', frame:4}],
        //     frameRate: 20,
        // });

        // this.anims.create({
        //     key: 'restDown',
        //     frames: [{key: 'player', frame:0}],
        //     frameRate: 20,
        // });

        // What to create?
        const map = this.make.tilemap({key: 'map'});

        const tiles = map.addTilesetImage('stage', 'mainRoom');
        const vat = map.addTilesetImage('vat small', 'vat');
        const floor = map.createStaticLayer('Floor Layer', tiles, 0,0);
        const walls = map.createStaticLayer('Wall Layer', tiles, 0,0);
        walls.setCollisionByExclusion([-1]);

        this.vatLevel0 = map.createDynamicLayer('Vat Level 0', vat, 0, 0);
        this.vatLevel1 = map.createDynamicLayer('Vat Level 1', vat, 0, 0);
        this.vatLevel1.visible = false;
        this.vatLevel2 = map.createDynamicLayer('Vat Level 2', vat, 0, 0);
        this.vatLevel2.visible = false;
        this.sys.animatedTiles.init(map);
        this.sys.animatedTiles.setRate(0.5);

        this.crackAudio = this.sound.add('crack', {loop: false});

        this.interactables = [];

        const transformObject = (obj) => {
            const updatedObj = { ...obj };
            updatedObj.customProperties = obj.properties.reduce((acc, prop) => {
                acc[prop.name] = prop.value;
                return acc;
            }, {});
            updatedObj.customProperties = {
                ...updatedObj.customProperties,
                gid: updatedObj.gid,
                id: updatedObj.id,
            };
            updatedObj.get = (name) => updatedObj.customProperties[name];
            return updatedObj;
        };
        const createZone = (interactor) => {
            const x = interactor.x + (interactor.width / 2);
            const y = interactor.y + (interactor.height / 2);
            const zone = this.add.zone(x, y, interactor.width, interactor.height);
            zone.customProperties = {
                ...interactor.customProperties
            };
            zone.get = (name) => zone.customProperties[name];
            zone.set = (name, value) => zone.customProperties[name] = value;
            zone.getTarget = () => this.interactables.find((sprite) => {
                return sprite.get('id') == zone.get('forObject');
            });
            this.physics.world.enable(zone);
            zone.body.moves = false;
            return zone;
        };

        this.target = null;

        this.player = this.physics.add.sprite(732,623, 'Atlas');
        this.player2 = this.physics.add.sprite(932,623, 'Buck')
        this.player.setDepth(100);
        this.player2.setDepth(100);
        this.player.body.setSize(192,232);
        this.player2.body.setSize(192,232);
        this.player.body.offset.y=0;
        this.player2.body.offset.y=0;
        this.player.body.offset.x=20;
        this.player2.body.offset.x=20;
        this.player.body.debugShowBody;
        this.player2.body.debugShowBody;
        this.player.canMove = true;
        this.player2.canMove = true;
        this.player.performingMove = "none";
        this.player2.performingMove = "none";
        this.player.moveStage = -1;
        this.player2.moveStage = -1;
        this.player.moveProgress = 0;
        this.player2.moveProgress = 0;
        this.player.moveList = {
            standingLight: {
                moveStage: [
                    {
                        stageLength: 2,
                        xOffset: 120,
                        yOffset: 110,
                        height: 30,
                        width: 90,
                    },
                    {
                        stageLength: 5,
                        xOffset: 170,
                        yOffset: 60,
                        height: 30,
                        width: 90,
                    },
                    {
                        stageLength: 5,
                        xOffset: 170,
                        yOffset: 20,
                        height: 70,
                        width: 90,
                    }
                ]
            } ,
            standingLightHeavy: {
                moveStage: [
                    {
                        stageLength: 3,
                        xOffset: 140,
                        yOffset: 110,
                        height: 30,
                        width: 90,
                    },
                    {
                        stageLength: 7,
                        xOffset: 190,
                        yOffset: 60,
                        height: 30,
                        width: 90,
                    },
                    {
                        stageLength: 7,
                        xOffset: 190,
                        yOffset: 20,
                        height: 70,
                        width: 90,
                    }
                ]
            }
        }
        this.player2.moveList = {
            standingLight: {
                moveStage: [
                    {
                        stageLength: 2,
                        xOffset: 120,
                        yOffset: 110,
                        height: 30,
                        width: 90,
                    },
                    {
                        stageLength: 5,
                        xOffset: 170,
                        yOffset: 60,
                        height: 30,
                        width: 90,
                    },
                    {
                        stageLength: 5,
                        xOffset: 170,
                        yOffset: 20,
                        height: 70,
                        width: 90,
                    }
                ]
            } ,
            standingLightHeavy: {
                moveStage: [
                    {
                        stageLength: 3,
                        xOffset: 140,
                        yOffset: 110,
                        height: 30,
                        width: 90,
                    },
                    {
                        stageLength: 7,
                        xOffset: 190,
                        yOffset: 60,
                        height: 30,
                        width: 90,
                    },
                    {
                        stageLength: 7,
                        xOffset: 190,
                        yOffset: 20,
                        height: 70,
                        width: 90,
                    }
                ]
            }
        }
        // this.player.body.setGravityY(300)

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);
        this.player2.setCollideWorldBounds(true);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels=true;

        this.physics.add.collider(this.player, walls);
        this.physics.add.collider(this.player2, walls);
        // this.physics.add.collider(this.player, this.interactables);
        // this.physics.add.overlap(this.player, this.targetZones);

        this.createInput();
    }
    createInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys(
            {up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D,
            light: Phaser.Input.Keyboard.KeyCodes.J,
            heavy: Phaser.Input.Keyboard.KeyCodes.K,
            special: Phaser.Input.Keyboard.KeyCodes.L,
        });
        this.interaction = this.input.keyboard.addKeys({
            accept: Phaser.Input.Keyboard.KeyCodes.E,
            accept2: Phaser.Input.Keyboard.KeyCodes.SPACE,
            // light: Phaser.Input.Keyboard.KeyCodes.J,
            // heavy: Phaser.Input.Keyboard.KeyCodes.K,
            // special: Phaser.Input.Keyboard.KeyCodes.L,
        });
        this.ui = this.input.keyboard.addKeys({
            pause: Phaser.Input.Keyboard.KeyCodes.ESC,
        });

        // this.debug = this.input.keyboard.addKeys('B,N');
        // this.debug.B.on('down', () => SystemState.displayMessage(this.chaos.getHungerMessage()));
        // this.debug.N.on('down', () => SystemState.displayMessage(this.chaos.getVatMessage()));

        // this.debugKey = this.input.keyboard.addKeys(
        //     {feed:Phaser.Input.Keyboard.KeyCodes.F,
        //     plant:Phaser.Input.Keyboard.KeyCodes.P}
        //     );

        this.previousPadState = {
            pause: false,
            accept: false,
        };
        this.previousKeyState = {
            pause: false,
            accept: false,
        };
    }

    update(time, delta) {
        SystemState.simulation.updateSimulation(delta);
        this.animatedTiles.updateAnimatedTiles();

        this.handleMovementInput();
        this.handleUIInput();
        this.handleInteractionInput();
        this.detectOverlap();
        // this.chaos.checkForMessage(time);
        // this.checkGrowthSprite();
        // this.checkFillSprite();
        this.checkGodLevel();
        // this.checkScripts();
        this.checkMoves();
    }

    handleMovementInput() {

        if (SystemState.allowMovement) {
            // console.log(this.player.body.y)
            const { playerVelocityY } = globalConfig;
            const { playerVelocityX } = globalConfig;
            const gamepad = this.input.gamepad.getPad(0);
            //  var horizontalMove = 0;
            //  var verticalMove = 0;

            // Horizontal movement
            if(this.player.canMove) {
                if(this.wasd.light.isDown) {
                    this.player.canMove = false;
                    this.player.performingMove = 'standingLightHeavy'
                } else {
                    if(this.player.body.y > 503.9) {
                        this.player.body.setVelocityX(0);
                        if (this.cursors.left.isDown || this.wasd.left.isDown || (gamepad && gamepad.left))
                        {
                            this.player.body.setVelocityX(-playerVelocityX);
                            // horizontalMove--;
                        }
                        else if (this.cursors.right.isDown || this.wasd.right.isDown || (gamepad && gamepad.right))
                        {
                            this.player.body.setVelocityX(playerVelocityX);
                            // horizontalMove++;
                        }
                    }

                    // Vertical movement
                    if (this.cursors.up.isDown || this.wasd.up.isDown || (gamepad && gamepad.up))
                    {
                        if(this.player.body.y > 503.9)
                        {
                            this.player.body.setVelocityY(-playerVelocityY*1.5);
                            // verticalMove--;
                        }
                    }
                    else if(this.cursors.down.isDown || this.wasd.down.isDown || (gamepad && gamepad.down))
                    {
                        // this.player.body.setVelocityY(playerVelocityY);
                        // verticalMove++;
                    }
                }

                // if (gamepad) {
                //     const stickPos = gamepad.leftStick;
                //     if (Math.abs(stickPos.x) > .2) {
                //         this.player.body.setVelocityX(stickPos.x * playerVelocityX);
                //         if(stickPos.x > 0) {
                //             horizontalMove++;
                //         } else {
                //             horizontalMove--;
                //         }
                //     }
                //     if (Math.abs(stickPos.y) > .2) {
                //         this.player.body.setVelocityY(stickPos.y * playerVelocityY);
                //         if(stickPos.y > 0) {
                //             verticalMove++;
                //         } else {
                //             verticalMove--;
                //         }
                //     }
                // }

                // if(verticalMove>0) {
                //     this.player.anims.play('down',true);
                //     this.nextRest = 'restDown';
                // } else if(verticalMove<0) {
                //     this.player.anims.play('up',true);
                //     this.nextRest = 'restUp';
                // } else if(horizontalMove>0) {
                //     this.player.anims.play('right',true);
                //     this.nextRest = 'restRight';
                // } else if(horizontalMove<0) {
                //     this.player.anims.play('left',true);
                //     this.nextRest = 'restLeft';
                // } else {
                //     this.player.anims.play(this.nextRest);
                // }
            }
        }
    }

    checkMoves() {
        if(!this.player.canMove) {
            if(this.player.performingMove != 'none') {
                var playerMove = this.player.moveList[this.player.performingMove].moveStage;
                if(this.player.moveStage == -1) {
                    this.player.body.setVelocityX(0);
                    this.player.body.setVelocityY(0);
                    this.player.moveStage = 0;
                    this.hitBox = this.add.rectangle(
                        this.player.body.x + playerMove[0].xOffset,
                        this.player.body.y + playerMove[0].yOffset,
                        playerMove[0].width,
                        playerMove[0].height
                    )
                    this.hitBox.isFilled = false;
                    this.hitBox.setOrigin(0,0);
                    this.hitBox.setStrokeStyle(4, 0x6495ed);
                    this.hitBox.setDepth(101);
                } else {
                    this.player.moveProgress++;
                    if(this.player.moveProgress > playerMove[this.player.moveStage].stageLength) {
                        this.player.moveStage++;
                        if(this.player.moveStage >= playerMove.length) {
                            this.player.performingMove = 'none';
                            this.player.moveStage = -1;
                            this.player.moveProgress = 0;
                            this.hitBox.destroy();
                            this.hitBox = null;
                            this.player.canMove = true;
                        } else {
                            this.hitBox.destroy();
                            this.hitBox = this.add.rectangle(
                                this.player.body.x + playerMove[this.player.moveStage].xOffset,
                                this.player.body.y + playerMove[this.player.moveStage].yOffset,
                                playerMove[this.player.moveStage].width,
                                playerMove[this.player.moveStage].height
                                )
                            this.hitBox.isFilled = false;
                            this.hitBox.setOrigin(0,0);
                            this.hitBox.setStrokeStyle(4, 0x6495ed);
                            this.hitBox.setDepth(101);
                        }
                        this.player.moveProgress = 0;
                    }
                }
            }
        }
    }

    handleUIInput() {
        const gamepad = this.input.gamepad.getPad(0);
        const curPadState = {
            pause: gamepad && gamepad.buttons[9].value === 1,
        };
        const curKeyState = {
            pause: this.ui.pause.isDown
        };

        if ((!this.previousKeyState.pause && curKeyState.pause) || (!this.previousPadState.pause && curPadState.pause)) {
            if (SystemState.isPaused) {
                SystemState.unpause();
            } else {
                SystemState.pause();
            }
        }

        this.previousPadState = {
            ...this.previousPadState,
            ...curPadState,
        };
        this.previousKeyState = {
            ...this.previousKeyState,
            ...curKeyState,
        };
    }

    handleInteractionInput() {
        if (SystemState.allowInteraction || SystemState.allowMessageInteraction) {
            const gamepad = this.input.gamepad.getPad(0);
            const curPadState = {
                accept: gamepad && gamepad.buttons[0].value === 1,
            };
            const curKeyState = {
                accept: this.interaction.accept.isDown || this.interaction.accept2.isDown,
            };

            if ((!this.previousKeyState.accept && curKeyState.accept) || (!this.previousPadState.accept && curPadState.accept)) {
                if (SystemState.message.current && SystemState.allowMessageInteraction) {
                    if (SystemState.message.playing) {
                        SystemState.skipMessage();
                    } else {
                        SystemState.dismissMessage();
                        // this.completeScriptStep();
                    }
                }
                else if (this.nearest && SystemState.allowInteraction) {
                    const type = this.nearest.get && this.nearest.get('objectType');
                    switch (type) {
                    case 'plot':
                        this.interactWithPlot(this.nearest); break;
                    case 'spring':
                        this.interactWithSpring(this.nearest); break;
                    case 'foodTerminal':
                        this.interactWithFoodTerminal(); break;
                    case 'fuelTerminal':
                        this.interactWithFuelTerminal(); break;
                    case 'fert':
                        this.interactWithFert(); break;
                    }
                }
            }

            this.previousPadState = {
                ...this.previousPadState,
                ...curPadState,
            };
            this.previousKeyState = {
                ...this.previousKeyState,
                ...curKeyState,
            };
        } else {
            this.previousPadState = {
                ...this.previousPadState,
                accept: false,
            };
            this.previousKeyState = {
                ...this.previousKeyState,
                accept: false,
            };
        }
    }

    detectOverlap() {
        if (!this.player.body.touching.none || this.player.body.embedded) {
            const overlaps = [];
            this.physics.overlap(this.player, this.targetZones, (player, interactor) => overlaps.push(interactor));
            if (!overlaps.length) return;

            const mainOverlap = this.physics.closest(this.player, overlaps);

            const nearest = mainOverlap.getTarget ? mainOverlap.getTarget() : mainOverlap;

            if (nearest != this.nearest) {
                this.nearest = nearest;
                if (this.target) {
                    this.target.destroy();
                    this.target = null;
                }
            }
            if (!this.target) {
                this.target = this.add.rectangle(this.nearest.x, this.nearest.y, this.nearest.width, this.nearest.height);
                this.target.isFilled = false;
                this.target.setStrokeStyle(4, 0x6495ed);
                this.target.setDepth(99);
            }

            this.displayInteractAction(this.nearest);
        } else {
            this.nearest = null;
            if (this.target) {
                this.target.destroy();
                this.target = null;
            }
            SystemState.currentInstruction = null;
        }
    }

    displayInteractAction(focus) {
        const type = focus.get && focus.get('objectType');
        if (type === 'plot') {
            var idx = focus.get('plotIndex');
            if(!SystemState.farm[idx].planted) {
                SystemState.currentInstruction = 'plant a piece of Embroja';
            } else if (SystemState.farm[idx].harvestable) {
                SystemState.currentInstruction = 'harvest Embroja';
            } else if (!SystemState.farm[idx].fert) {
                SystemState.currentInstruction = 'use fertilizer';
            }
        } else if(type === 'spring') {
            var idx = focus.get('springIndex');
            if(!SystemState.fountain[idx].planted) {
                SystemState.currentInstruction = 'prime the spring with 1 Nektare';
            } else if (SystemState.fountain[idx].currentUnits > 0) {
                SystemState.currentInstruction = 'harvest Nektare';
            } else {
                if(SystemState.fountain[idx].rateLevel !=4) {
                    SystemState.currentInstruction = 'upgrade spring with 1 Nektare';
                }
            }
        } else if(type === 'foodTerminal') {
            SystemState.currentInstruction = 'feed Serpens';
        } else if(type === 'fuelTerminal') {
            SystemState.currentInstruction = 'refill vat';
        } else if(type === 'fert') {
            SystemState.currentInstruction = 'spend 5 Embroja and Nektare each to make fertilizer';
        }
    }

    checkGodLevel() {
        if (SystemState.god.level == 2) {
            this.vatLevel0.visible = false;
            this.vatLevel1.visible = true;
        } else if (SystemState.god.level == 3) {
            this.vatLevel1.visible = false;
            this.vatLevel2.visible = true;
        }
    }
}

export default MainScene;