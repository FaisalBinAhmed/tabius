export default function CustomModal({
	isVisible = false,
	toggleVisibility,
}: {
	isVisible: boolean;
	toggleVisibility: () => void;
}) {
	return (
		<div class="modal" style={{ display: isVisible ? "block" : "none" }}>
			{/* <!-- Modal content --> */}
			<div class="modal-content">
				<div style="padding: 20px 20px 0px 20px">
					<span onClick={toggleVisibility} class="close">
						&times;
					</span>
					<p style="margin: 0px 0px 15px 0px; font-weight: 500">
						Custom Tab Grouping Rules
					</p>

					{/* <!-- adding rules content --> */}

					<div id="ruleinputcontainer">
						<div class="inputblock" style="flex: 1">
							<label for="groupsite">URL</label>
							<input
								type="text"
								placeholder="https://facebook.com"
								name="groupsite"
								id="customUrl"
							/>
						</div>
						<div class="inputblock">
							<label>&#10240;</label>
							<span style="margin-left: 5px; margin-right: 5px">&#10132;</span>
						</div>

						<div class="inputblock">
							<label for="groupalias">Short Name or Alias</label>
							<input
								type="text"
								id="customAlias"
								placeholder="FB"
								name="groupalias"
							/>
						</div>

						<div class="inputblock" style="margin-left: 5px">
							<label for="groupcolor">Group Color</label>
							<select id="colors" name="groupcolor">
								<option value="">Random</option>
								<option value="grey" style="background-color: #e0e0e0">
									grey
								</option>
								<option value="blue" style="background-color: #82b1ff">
									blue
								</option>
								<option value="red" style="background-color: #e57373">
									red
								</option>
								<option value="yellow" style="background-color: #fff176">
									yellow
								</option>
								<option value="green" style="background-color: #81c784">
									green
								</option>
								<option value="pink" style="background-color: #ff80ab">
									pink
								</option>
								<option value="purple" style="background-color: #ea80fc">
									purple
								</option>
								<option value="cyan" style="background-color: #84ffff">
									cyan
								</option>
							</select>
						</div>

						<div class="inputblock">
							<label>&#10240;</label>
							<button id="addbutton">Add</button>
						</div>
					</div>

					{/* <!-- existing rules --> */}
					<p style="font-size: 12px">
						Please put the website URL in this format: "https://somewebsite.com"
						or "http://sub.domain.com" without the quotes. Note: only the origin
						part of the URL (https://www.domain.com) is considered. The rules
						are applicable when you open new tabs from these websites - in other
						words - when they are the
						<b>original tab</b>. The rules are also
						<b>subdomain sensitive</b>, meaning "https://en.wikipedia.com" is
						treated differenty than "https://wikipedia.com". Duplicate entries
						will be ignored.
					</p>
				</div>
				<div
					style="
								background-color: #0d0d0d;
								color: #fff;
								padding: 10px 20px 20px 20px;
							">
					<p style="margin: 0px 0px 10px 0px; font-size: 16px">
						Modify Existing Rules
					</p>
					{/* <!-- <p style="font-size: 12px !important">
								No Custom Rules yet. Add your first one above.
							</p> --> */}
					<div id="rulescontainer"></div>
				</div>
			</div>
		</div>
	);
}
