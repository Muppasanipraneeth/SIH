from flask import Flask, request, render_template
import pandas as pd

# Initialize Flask app
app = Flask(__name__)

# Sample DataFrame

df = pd.read_csv('final_pincode.csv')

# Function to check and suggest correct pincode
def find_correct_pincode(df, office_name, district, state, given_pincode):
    office_name = office_name.upper()
    district = district.upper()
    state = state.upper()

    df['OfficeName'] = df['OfficeName'].str.upper()
    df['District'] = df['District'].str.upper()
    df['StateName'] = df['StateName'].str.upper()

    office_match_df = df[df['OfficeName'] == office_name]

    if office_match_df.empty:
        return "No matching office name found"
    
    if len(office_match_df) > 1:
        state_match_df = office_match_df[office_match_df['StateName'] == state]
        
        if state_match_df.empty:
            return f"OfficeName found but no matching State. Available states: {office_match_df['StateName'].unique()}"
        
        if len(state_match_df) > 1:
            district_match_df = state_match_df[state_match_df['District'] == district]
            
            if district_match_df.empty:
                return f"State matches but no matching District. Available districts: {state_match_df['District'].unique()}"
            
            row = district_match_df.iloc[0]
            if row['Pincode'] == given_pincode:
                return "Address matches the pincode"
            else:
                return f"Pincode doesn't match. The correct pincode is {row['Pincode']}"
        
        row = state_match_df.iloc[0]
        if row['Pincode'] == given_pincode:
            return "Address matches the pincode"
        else:
            return f"Pincode doesn't match. The correct pincode is {row['Pincode']}"
    
    row = office_match_df.iloc[0]
    if row['Pincode'] == given_pincode:
        return "Address matches the pincode"
    else:
        return f"Pincode doesn't match. The correct pincode is {row['Pincode']}"

# Define route for the homepage
@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        office_name = request.form['office_name']
        district = request.form['district']
        state = request.form['state']
        given_pincode = int(request.form['pincode'])

        result = find_correct_pincode(df, office_name, district, state, given_pincode)
        return render_template('index.html', result=result)

    return render_template('index.html', result='')

if __name__ == '__main__':
    app.run(debug=True)
