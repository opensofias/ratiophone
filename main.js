"use strict";

var audio = new AudioContext ()
var globalGain = audio.createGain ()
globalGain.connect (audio.destination)
globalGain.gain.value = 0.2
var base_freq = 440

class Node
{
	constructor (branch, parent, depth)
	{
		this.el = document.createElement("div")
		this.parent = parent

		if (branch == -1) this.a = [1,1]
		else
		{
			this.a = parent.a.slice()
			this.a [branch] = parent.a [0] + parent.a [1]
		}
		//this.el.innerHTML = this.a[0] / this.a [1]
		
		

		if (depth > 0) this.children =
		[
			new Node (0, this, depth - 1),
			new Node (1, this, depth - 1)
		]

		var press = this.press.bind(this)
		var release = this.release.bind(this)

		this.el.addEventListener("touchstart", press, false)
		this.el.addEventListener("touchend", release, false)
		this.el.addEventListener("touchcancel", release, false)

		this.el.onselectstart = () => false
		this.el.oncontextmenu = () => false

		parent.el.appendChild(this.el)
	}

	press (event)
	{
		event.stopPropagation()
		this.osci = audio.createOscillator ()
		this.osci.frequency.value = base_freq * this.a[0] / this.a[1]
		this.osci.connect(globalGain)
		this.osci.type = "sine"
		this.osci.start()
		this.el.classList.add ("pressed")
	}

	release (event)
	{
		event.stopPropagation()
		this.osci.stop(); this.osci.disconnect()
		this.el.classList.remove ("pressed")
	}
}

var subroot = {el : document.body}

var root = new Node (-1, subroot, 5)