package com.publiceye.app.presentation.survey

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.publiceye.app.R
import com.publiceye.app.presentation.home.HomeBottomNavigation

@Composable
fun SurveyScreen(
    onNavigateBack: () -> Unit,
    onNavigateTo: (String) -> Unit
) {
    val questions = remember {
        listOf(
            SurveyQuestion(
                "Q1", "Is waste collected from your household/shop on a daily basis?",
                listOf("Yes, everyday", "3-4 times a week", "Twice a week", "Rarely", "Never")
            ),
            SurveyQuestion(
                "Q2", "Do you segregate your waste into Wet and Dry categories before disposal?",
                listOf("Yes, always", "Sometimes", "No, never", "Not aware of segregation")
            ),
            SurveyQuestion(
                "Q3", "How would you rate the general cleanliness of your neighborhood?",
                listOf("Excellent", "Good", "Average", "Poor", "Very Poor")
            ),
            SurveyQuestion(
                "Q4", "Are public garbage bins available at accessible distances in your area?",
                listOf("Yes, plenty", "Yes, but very few", "No, none available")
            ),
            SurveyQuestion(
                "Q5", "How often do you see public garbage bins being cleared by authorities?",
                listOf("Daily", "Twice a week", "Weekly", "Monthly", "Never cleared")
            ),
            SurveyQuestion(
                "Q6", "Are you satisfied with the maintenance of the drainage system in your ward?",
                listOf("Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied")
            ),
            SurveyQuestion(
                "Q7", "How effective are local authorities in maintaining cleanliness in public spaces?",
                listOf("Very effective", "Effective", "Neutral", "Ineffective", "Very ineffective")
            ),
            SurveyQuestion(
                "Q8", "Do you see people openly urinating or defecating in public areas near you?",
                listOf("No, Never", "Yes, Rarely", "Yes, Sometimes", "Yes, Frequently")
            ),
            SurveyQuestion(
                "Q9", "How satisfied are you with the cleanliness and accessibility of public toilets?",
                listOf("Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied", "Have not used any")
            ),
            SurveyQuestion(
                "Q10", "Are you aware of RRR (Reduce, Reuse, Recycle) centers in your city?",
                listOf("Yes, I use them", "I have heard of them", "No, not aware at all")
            ),
            SurveyQuestion(
                "Q11", "Have you ever registered a complaint regarding waste or cleanliness in the app?",
                listOf("Yes, multiple times", "Yes, once", "No, never had an issue", "No, didn't know how to")
            ),
            SurveyQuestion(
                "Q12", "How would you rate the city's overall response and resolution time for civic complaints?",
                listOf(
                    "5 (Addressed and resolved quickly)",
                    "4 (Resolved but required follow-up)",
                    "3 (Addressed but not resolved satisfactorily)",
                    "2 (Acknowledged but no action taken)",
                    "1 (Ignored or not registered)",
                    "N/A (No complaints made)"
                )
            )
        )
    }

    Scaffold(
        bottomBar = {
            HomeBottomNavigation(currentRoute = "notifications", onNavigate = onNavigateTo)
        },
        containerColor = Color(0xFFF1F5F9) // Light gray background
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // HEADER - Teal Gradient
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(110.dp)
                    .background(
                        Brush.verticalGradient(
                            listOf(Color(0xFF00B7A8), Color(0xFF009688))
                        )
                    )
                    .statusBarsPadding(),
                contentAlignment = Alignment.Center
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    IconButton(onClick = onNavigateBack) {
                        Icon(
                            painter = painterResource(id = R.drawable.ic_back),
                            contentDescription = "Back",
                            tint = Color.White
                        )
                    }
                    Text(
                        text = "Survey",
                        color = Color.White,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Icon(
                        painter = painterResource(id = R.drawable.ic_map_pin),
                        contentDescription = "Location",
                        tint = Color.White,
                        modifier = Modifier.size(24.dp)
                    )
                }
            }

            // Scrollable List of Questions
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(questions) { question ->
                    SurveyQuestionCard(question)
                }

                item {
                    Button(
                        onClick = { onNavigateBack() },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 16.dp)
                            .height(56.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00B7A8))
                    ) {
                        Text("Submit Feedback", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

data class SurveyQuestion(
    val id: String,
    val question: String,
    val options: List<String>
)

@Composable
fun SurveyQuestionCard(question: SurveyQuestion) {
    var selectedOption by remember { mutableStateOf<String?>(null) }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Text(
                text = "${question.id}: ${question.question}",
                fontWeight = FontWeight.Bold,
                fontSize = 17.sp,
                color = Color(0xFF1E293B),
                lineHeight = 24.sp
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            question.options.forEach { option ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .clickable { selectedOption = option }
                        .padding(vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    RadioButton(
                        selected = (selectedOption == option),
                        onClick = { selectedOption = option },
                        colors = RadioButtonDefaults.colors(selectedColor = Color(0xFF00B7A8))
                    )
                    Text(
                        text = option,
                        color = Color(0xFF475569),
                        fontSize = 15.sp,
                        modifier = Modifier.padding(start = 8.dp)
                    )
                }
            }
        }
    }
}
